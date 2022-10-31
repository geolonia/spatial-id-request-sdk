# 空間 ID データ取得SDK

## 概要

空間IDを利用し、ベクトルタイルをクエリーできるNode.jsライブラリです。このライブラリは、リクエスト先URL（ベクトルタイルを指すソース情報）とクエリーする空間IDをインプットとし、その空間IDと重なる地物をGeoJSON型としてアウトプットします。

## インストール方法

NodeJS またはブラウザの環境で動作します。NodeJSの場合は npm でインストールします：

```
npm install https://github.com/geolonia/spatial-id-request-sdk -S
```
_(TODO: 組織移管先決定後訂正)_

ブラウザの場合は `<script>` タグで読み込ませてください：

```
<script src="https://geolonia.github.io/spatial-id-request-sdk/spatial-id-request.js"></script>
```

ブラウザの場合は、 `SpatialIdRequest` のグローバル変数に入ります。

## 各種メソッドの利用方法とサンプルコード

### 空間ID を導出する

ズームレベル、高さ、緯度、経度から、空間ID インスタンスを生成します。

```
// ZFXY文字列
new SpatialIdRequest.Space('16/0/58206/25807');
// 緯度経度+標高（ `alt` ）
new SpatialIdRequest.Space({lng: 139.73785400390625, lat: 35.675705221389876, alt: 30});
```

詳細は [こちらを確認してください](https://github.com/spatial-id/javascript-sdk#%E3%82%B3%E3%83%B3%E3%82%B9%E3%83%88%E3%83%A9%E3%82%AF%E3%82%BF)

### 空間ID API へリクエストを送信し、レスポンスをGeoJSON形式で取得する

空間ID API 基盤のURLと空間IDをインプットとし、レスポンスをGeoJSON形式で確認することができます。

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

実際のリクエスト先URLと空間IDを用いたサンプルコードとレスポンスは、

https://geolonia.github.io/spatial-id-request-sdk/

で確認することが可能です。

### 空間ID マニピュレーション

空間IDの分解能を変更したり、周辺オブジェクト等を取得したりするなど、空間データを操作する機能を提供しています。

* 指定した空間IDのボクセルを構成する8点の標高、緯度、経度および中心点を返す
* ある標高、緯度、経度が指定された空間IDに含まれるか判定する
* 指定した空間IDの一つ上もしくは一つ下の空間IDを返す
* 指定した空間IDの指定された方角に隣接する空間IDを返す
* 指定した空間IDの周囲にあるすべての空間IDを返す
* 指定した空間IDの親もしくは子の空間IDを返す

[メソッドドキュメンテーション](https://github.com/spatial-id/spatial-object-model-specification#readme)
