# 3D 空間 ID データ取得共通ライブラリ

空間IDを利用し、ベクトルタイルをクエリーできるライブラリです。このライブラリは、ベクトルタイルを指すソース情報とクエリーする空間IDをインプットとし、その空間IDと重なる地物をGeoJSON型としてアウトプットします。

## 利用方法

NodeJS またはブラウザの環境で動作します。NodeJSの場合は npm でインストールします：

**TODO**: 組織移管先決定後訂正
```
npm install https://github.com/geolonia/spatial-id-request-sdk -S
```

ブラウザの場合は `<script>` タグで読み込ませてください：

```
<script src="https://geolonia.github.io/spatial-id-request-sdk/spatial-id-request.js"></script>
```

ブラウザの場合は、 `SpatialIdRequest` のグローバル変数に入ります。

## ベクトルタイルのデータをクエリーする

```
const response = await SpatialIdRequest.queryVectorTile( source, spatialId, zoom? );
```

`source` は下記のオブジェクトを受付します。

| アトリビュート名 | 必須 | 説明 | 例 |
| --- | --- | --- | --- |
| `tiles` | `tiles` または `url` どちらか必須 | `{z}/{x}/{y}` を含むURLの配列を指す | `["https://geolonia.github.io/vector-tiles-api/tiles/{z}/{x}/{y}.mvt"]` |
| `url` | `tiles` または `url` どちらか必須 | `tiles` の配列が含む JSON を指す URL | `"https://geolonia.github.io/vector-tiles-api/tiles/tiles.json"` |
| `minzoom` | × | ベクトルタイルをリクエストするズームレベルの下限を指定する。このズームレベル以下のタイルはリクエストしません。 | `0` |
| `maxzoom` | × | ベクトルタイルをリクエストするズームレベルの上限を指定する。クエリーする空間IDの分解能が `maxzoom` を超える場合、 `maxzoom` でのタイルをリクエストし、クエリーの空間IDに結果を絞る | `7` |

`spatialId` は [空間ID JavaScript SDK](https://github.com/spatial-id/javascript-sdk) で作られたオブジェクト、またはその初期化値を渡すことができます。下記の例を確認してください。

```
..., new SpatialIdRequest.Space('16/0/58206/25807'));
..., "16/0/58206/25807");
..., {lng: 139.73785400390625, lat: 35.675705221389876}, 16);
```

[サンプルを見る](https://geolonia.github.io/spatial-id-request-sdk/)
