import * as SpatialId from "@spatial-id/javascript-sdk";
import type GeoJSON from "geojson";
import { LngLatWithAltitude } from "@spatial-id/javascript-sdk/dist/types";
import { ZFXYTile } from "@spatial-id/javascript-sdk/dist/zfxy";
export declare type Space = SpatialId.Space;
export declare const Space: typeof SpatialId.Space;
export declare type RequestSource = {
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
declare type QueryVectorTile = (source: RequestSource, id: Space | LngLatWithAltitude | ZFXYTile | string) => Promise<GeoJSON.FeatureCollection>;
export declare const queryVectorTile: QueryVectorTile;
export {};
