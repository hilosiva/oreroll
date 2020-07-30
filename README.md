# Oreroll
俺のスクロール アニメーションライブラリ

## Demo
https://hilosiva.github.io/oreroll/


## Install
HTMLファイルに `oreroll.css` と `oreroll.js` を読み込んでください。

なお、現在はIE11に対応することも多いと思います。
その場合は、さらに polyfill も利用してください。

https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Oreroll</title>
  <!-- oreroll.cssを読み込む -->
  <link rel="stylesheet" href="../assets/css/oreroll.css">

  <!-- IE11に対応する場合は以下の polyfill も読み込む -->
  <script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver" defer></script>

  <!-- oreroll.jsを読み込む -->
  <script src="../assets/js/oreroll.js" defer></script>
</head>
<body>

</body>
</html>
```

`oreroll.css` と `oreroll.js` はそれぞれ、圧縮版の`oreroll.min.css` と `oreroll.min.js` も用意してますので、必要に応じてご利用ください。


### Polyfillを利用（IEへの対応を）しない場合
現在 IEへの対応はすることが多いと思いますが、Polyfillを利用しない場合は、 `oreroll.js` の 以下の行をコメントにするか削除するかしてください

```JavaScript
 observer.POLL_INTERVAL = 100;
 ```

## How to Use
### 基本の使い方
アニメーションさせたい要素に、 `.oreroll` というclassを指定し、`data-type` 属性で、アニメーションの種類を指定します。

なお、アニメーションの種類は、半角スペース区切りで複数指定することができますが、組み合わせによってはうまく動作しないものもあります。


```html
<p class="oreroll" data-type="fadeIn">Fade In</p>
<p class="oreroll" data-type="zoomIn textClosing">Zoom In &amp; Text Closing</p>
```

#### アニメーションの種類
|  値  |  説明  |
| ---- | ---- |
|  fadeIn  |  フェードイン  |
|  slideRightIn  |  左から右に移動  |
|  slideRightIn  |  右から左に移動  |
|  slideUpIn  |  下から上に移動  |
|  slideDownIn  |  上から下に移動  |
|  zoomIn  |  ズームイン  |
|  textCloseIn  |  文字を閉じる  |
|  textShadowIn  |  影から実体化  |


### オプション
#### イージング

```html
<p class="oreroll" data-type="slideRightIn" data-easing=" ease-out-expo">勢いよく減速</p>
<p class="oreroll" data-type="zoomIn" data-easing="out-back">行き過ぎて戻ってくる</p>
```


#### イージングの種類
`data-easing` 属性でイージングの種類を指定できます。
|  値  |  説明  |
| ---- | ---- |
|  linear  |  一定の速度  |
|  ease  |  ゆるやかな加速減速  |
|  ease-in  |  加速  |
|  ease-out  |  減速（初期値）  |
|  ease-in-out  |  加速減速  |
|  ease-in-expo  |  強めの加速  |
|  ease-out-expo  |  強めの減速  |
|  in-back  |  一旦下がって加速  |
|  out-back  |  行き過ぎて戻って減速  |


#### デュレーション
`data-duration` 属性を `fast` 、 `normal`、`slow` のいずれかで指定。


```html
<p class="oreroll" data-type="fadeIn" data-duration="fast">Fast</p>
<p class="oreroll" data-type="zoomIn textClosing" data-duration="slow">Zoom In &amp; Text Closing</p>
```

#### デュレーションの種類

|  値  |  説明  |
| ---- | ---- |
|  fast  |  0.3秒  |
|  normal  |  1秒（初期値）  |
|  slow  |  2秒  |


ですが、`oreroll.scss` の中の冒頭の変数で自由変更して下さい。

また機能は追加します。
