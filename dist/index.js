'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fetch = require('cross-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var createTileUrl = function (template, id) { return (template
    .replace('{z}', id.zfxy.z.toString())
    .replace('{f}', id.zfxy.f.toString())
    .replace('{x}', id.zfxy.x.toString())
    .replace('{y}', id.zfxy.y.toString())); };
var requestToGeoJSON = function (source, id) { return __awaiter(void 0, void 0, void 0, function () {
    var tilejson, response_1, _a, tiles, rawMinzoom, maxzoom, minzoom, requestZoom, requestTile, tileUrl, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                tilejson = source;
                if (!("url" in source)) return [3 /*break*/, 3];
                return [4 /*yield*/, fetch__default["default"](source.url)];
            case 1:
                response_1 = _b.sent();
                _a = [{}];
                return [4 /*yield*/, response_1.json()];
            case 2:
                tilejson = __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), tilejson]);
                _b.label = 3;
            case 3:
                if (!("tiles" in tilejson)) {
                    throw new Error("TileJSON must contain a 'tiles' property");
                }
                tiles = tilejson.tiles, rawMinzoom = tilejson.minzoom, maxzoom = tilejson.maxzoom;
                minzoom = rawMinzoom || 0;
                if (minzoom !== undefined && id.zoom < minzoom) {
                    throw new Error("Not implemented: zoom level of requested Spatial ID (".concat(id.zoom, ") is below minimum zoom ").concat(minzoom));
                }
                requestZoom = Math.min(maxzoom || 25, id.zoom);
                requestTile = id.parent(requestZoom);
                tileUrl = createTileUrl(tiles[0], requestTile);
                return [4 /*yield*/, fetch__default["default"](tileUrl)];
            case 4:
                response = _b.sent();
                return [4 /*yield*/, response.arrayBuffer()];
            case 5:
                _b.sent();
                // decode vector tile, transform to GeoJSON
                // ...
                // not implemented yet
                return [2 /*return*/, {
                        type: "FeatureCollection",
                        features: [],
                    }];
        }
    });
}); };

exports.requestToGeoJSON = requestToGeoJSON;
//# sourceMappingURL=index.js.map
