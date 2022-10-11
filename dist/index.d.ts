import { Space } from "@spatial-id/javascript-sdk";
import type GeoJSON from "geojson";
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
declare type RequestToGeoJSON = (source: RequestSource, id: Space) => Promise<GeoJSON.FeatureCollection>;
export declare const requestToGeoJSON: RequestToGeoJSON;
export {};
