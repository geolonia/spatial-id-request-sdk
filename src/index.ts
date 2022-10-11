import { Space } from "@spatial-id/javascript-sdk";
import origFetch from "cross-fetch";

import { VectorTile } from "@mapbox/vector-tile";
import Protobuf from "pbf";

import type GeoJSON from "geojson";

const fetch = origFetch.bind(undefined);

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

type RequestToGeoJSON = (source: RequestSource, id: Space) => Promise<GeoJSON.FeatureCollection>;

export const requestToGeoJSON: RequestToGeoJSON = async (source, id) => {
  let tilejson = source;
  if ("url" in source) {
    const response = await fetch(source.url);
    tilejson = {
      ...(await response.json()),
      ...tilejson,
    };
  }
  if (!("tiles" in tilejson)) {
    throw new Error("TileJSON must contain a 'tiles' property");
  }

  const { tiles, minzoom: rawMinzoom, maxzoom } = tilejson;
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
  const tileUrl = createTileUrl(tiles[0], requestTile);

  const response = await fetch(tileUrl);
  const data = await response.arrayBuffer();

  // decode vector tile, transform to GeoJSON
  const tile = new VectorTile(new Protobuf(data));
  const out: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  for (const layerName in tile.layers) {
    const layer = tile.layers[layerName];
    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i).toGeoJSON(requestTile.zfxy.x, requestTile.zfxy.y, requestTile.zfxy.z);
      out.features.push(feature);
    }
  }

  return out;
};
