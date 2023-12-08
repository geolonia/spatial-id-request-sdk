import * as SpatialId from "@spatial-id/javascript-sdk";
import origFetch from "cross-fetch";

import * as pmtiles from "pmtiles";

import { VectorTile } from "@mapbox/vector-tile";
import Protobuf from "pbf";
import turfBooleanIntersect from '@turf/boolean-intersects';

import type GeoJSON from "geojson";
import { LngLatWithAltitude } from "@spatial-id/javascript-sdk/dist/types";
import { ZFXYTile } from "@spatial-id/javascript-sdk/dist/zfxy";

export type Space = SpatialId.Space;
export const Space = SpatialId.Space;
const fetch: typeof origFetch = origFetch.bind(undefined);

// A subset of the TileJSON specification
export type RequestSource = {
  type: "vector";
  tiles: string[];
  minzoom?: number;
  maxzoom?: number;
} | {
  type: "vector";
  url: string;
  minzoom?: number;
  maxzoom?: number;
};

const createTileUrl = (template: string, id: Space) => (
  template
    .replace('{z}', id.zfxy.z.toString())
    .replace('{f}', id.zfxy.f.toString())
    .replace('{x}', id.zfxy.x.toString())
    .replace('{y}', id.zfxy.y.toString())
)

const getTileContents = async (src: string | pmtiles.PMTiles, tile: Space) => {
  if (typeof src === 'string') {
    const tileUrl = createTileUrl(src, tile);
    const response = await fetch(tileUrl);
    if (!response.ok) {
      throw new Error(`Tile request to ${tileUrl} failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.arrayBuffer();
    return data;
  } else {
    const rangeResp = await src.getZxy(tile.zfxy.z, tile.zfxy.x, tile.zfxy.y);
    if (!rangeResp) {
      throw new Error(`Tile request to ${tile.zfxy.z}/${tile.zfxy.x}/${tile.zfxy.y} failed: no tile found`);
    }
    return rangeResp.data;
  }
};

type QueryVectorTile = (source: RequestSource, id: Space | LngLatWithAltitude | ZFXYTile | string, zoom?: number) => Promise<GeoJSON.FeatureCollection>;

export const queryVectorTile: QueryVectorTile = async (source, inputId, zoom) => {
  let id: Space;
  if (inputId instanceof Space) {
    id = inputId;
  } else {
    id = new Space(inputId, zoom);
  }

  let pmtilesSource: pmtiles.PMTiles | undefined = undefined;

  let tilejson = source;
  if ("url" in source) {
    const url = new URL(source.url);
    if (url.pathname.endsWith(".pmtiles")) {
      pmtilesSource = new pmtiles.PMTiles(source.url);
    } else {
      const response = await fetch(source.url);
      if (!response.ok) {
        throw new Error(`TileJSON request to ${source.url} failed: ${response.status} ${response.statusText}`);
      }
      tilejson = {
        ...(await response.json()),
        ...tilejson,
      };
    }
  }
  if (typeof pmtilesSource === 'undefined' && !("tiles" in tilejson)) {
    throw new Error("TileJSON must contain a 'tiles' property");
  }

  const { minzoom: rawMinzoom, maxzoom } = tilejson;
  const minzoom = rawMinzoom || 0;
  if (minzoom !== undefined && id.zoom < minzoom) {
    throw new Error(`Not implemented: zoom level of requested Spatial ID (${id.zoom}) is below minimum zoom ${minzoom}`);
  }
  const requestZoom = Math.min(maxzoom || 25, id.zoom);
  let requestTile: Space;
  if (requestZoom < id.zfxy.z) {
    requestTile = id.parent(requestZoom);
  } else {
    requestTile = id;
  }

  const src = typeof pmtilesSource !== 'undefined' ? pmtilesSource :
    'tiles' in tilejson ? tilejson.tiles[0] : '';

  const data = await getTileContents(src, requestTile);

  // decode vector tile, transform to GeoJSON
  const tile = new VectorTile(new Protobuf(data));
  const out: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  const zfxyGeom = id.toGeoJSON();

  for (const layerName in tile.layers) {
    const layer = tile.layers[layerName];
    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i).toGeoJSON(requestTile.zfxy.x, requestTile.zfxy.y, requestTile.zfxy.z);
      feature.properties._layer = layerName;
      if (turfBooleanIntersect(zfxyGeom, feature)) {
        out.features.push(feature);
      }
    }
  }

  return out;
};
