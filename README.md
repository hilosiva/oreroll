# Oreroll

Oreroll は、俺流のスクロールアニメーションライブラリです。
IntersectionObserver と requestAnimationFrame を使ってパフォーマンスに考慮しています。

なお、OrerollはHTMLの属性を切り替えたり、CSSカスタムプロパティをセットするだけに機能をフォーカスしているため、アニメーション部分はみなさんのCSSの知見を使って独自に拡張していただくことができます。

また、「Oreroll」という名前のせいで「実務で使うのはちょっと・・・」というとんでもないデメリットがあります。


[デモ](https://shibajuku.net/demo/oreroll/)


## インストール


### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@hilosiva/oreroll@0.1.0/dist/main.min.js" defer></script>
```

### NPM

```
npm i -D @hilosiva/oreroll
```

```javascript [main.js]
import Oreroll from "@hilosiva/oreroll";
```

## 使い方

スクロールアニメーションをトリガーしたいHTMLの要素をセレクターとして、Orerllを初期化します。

```html
<div data-trigger>
  ...
</div>
```

```javascript
new Oreroll('[data-trigger]');
```

これで、トリガー要素に `data-inview="false"` がセットされ、トリガー要素が画面内に入った時に、`data-inview` が　`true` に切り替わります。


以下のようなCSSを用意しトリガー要素に適用することで、トリガー要素が画面内に入った際にアニメーションを実行することができます。


```css
[data-trigger] {
  --duration: 0.6s;
  --easing: ease-out;
  --property: opacity;

  transition: var(--duration) var(--easing);
  transition-property: var(--property);
}

[data-trigger="fadeIn"] {
  &[data-inview="false"] {
    opacity: 0;
  }
  &[data-inview="true"] {
    opacity: 1;
  }
}

[data-trigger="blurIn"] {
  --property: opacity, filter;

  &[data-inview="false"] {
    filter: blur(8px);
    opacity: 0;
  }
  &[data-inview="true"] {
    filter: blur(0);
    opacity: 1;
  }
}

[data-trigger="slideUpIn"] {
  --property: opacity, translate;

  &[data-inview="false"] {
    translate: 0 3rem;
    opacity: 0;
  }
  &[data-inview="true"] {
    translate: 0 0;
    opacity: 1;
  }
}
```

```html
<div data-trigger="fadeIn">
  ...
</div>
```


OSの「視差効果を減らす」機能に対応する場合は、`@media`　の `prefers-reduced-motion` を活用してください。

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *:before,
  *:after {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
  }
}
```


トリガー要素に、`data-inview-target` 属性を指定すると、`data-inview`属性を付与する要素を変更できます。
これにより画面内に表示されたかを監視するトリガー要素と、実際にアニメーションを行うターゲットとなる要素に分けることができます。


```html
<div data-trigger data-inview-target="sample">
  ...
</div>

...

<div id="sample">
  ...
</div>
```


## オプション

Orerollには以下のオプションが利用できます。

| オプション名 | 値　| 型 |
| --- | --- | --- |
| `root` | IntersectionObserverの`root` プロパティで、ビューポートとなる要素を指定する（デフォルト： `null`） | Element、 Document、 null、undefined |
| `rootMargin`| IntersectionObserverの `rootMargin` プロパティで、`root` の周りのマージンを指定する（デフォルト： `0px`） | string、undefined |
| `threshold` |  IntersectionObserverの `threshold` プロパティで、ターゲットがどのくらいの割合見えてたらコールバックを実行するを指定する（デフォルト： `0`） | number、 number[]、 undefined |
| `once` | コールバックの実行を1度だけにする（デフォルト： `true`） |　boolean、 undefined |
| `scrub` | スクラブ機能を有効にする（デフォルト： `false`） |　boolean、 undefined |


`root`、`rootMargin`、`threshold` の詳細は、IntersectionObserverのドキュメントなどをご確認ください。

[交差オブザーバー API | Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Intersection_Observer_API)


```javascript
new Oreroll('[data-trigger]', { rootMargin: '0px 0px -30%' });
```


### once

`once` オプションを `false` にすることで、要素がビューポートに入るたびにコールバックを実行します。


```javascript
new Oreroll('[data-trigger]', {once: false});
```

### scrub

`scrub` オプションを `true` にするとスクラブ機能が有効になります。

スクラブ機能を有効にすると、ターゲット要素に `--progress` という名前のCSSカスタムプロパティが付加されます。

この、`--progress`はスクロール位置に応じて `0`（スクラブアニメーションの開始） ~ `1` （スクラブアニメーションの終了）に変化し、スクラブアニメーションの進捗度を表します。

デフォルトでは、トリガー要素がビューポートの下部に入った時に `0` となり、
トリガー要素がビューポートの上部に辿り着いた時に `1` となります。

スクラブ機能を有効にしたトリガー要素に、`data-start`属性を指定するとスクラブアニメーションを開始する位置を指定でき、`data-end`属性を指定するとスクラブアニメーションを終了する位置を指定できます。

（今後、`data-scrub-start` や `data-scrub-end` という属性名に変更する可能性があります）

位置はウインドウの上部を `0`、ウインドウの下部を`1` として数値で指定します。

トリガー要素がウインドウを超えてさらに画面の高さ分スクロールした位置を指定したい場合は `-1` となります。


```html
<figure data-scrub data-start="1" data-end="-1">
  <img
    src="pizza.jpg" alt="" decoding="async" loading="lazy"
  />
</figure>
```


```javascript
new Oreroll('[data-scrub]', {once: false, scrub: true});
```


以下のようなCSSを用意しターゲット要素に適用することで、 `--progress` に合わせてスクラブアニーメンションを実行できます。

```css
[data-scrub] {
  --progress: 0;
}

@media (prefers-reduced-motion: no-preference) {
  [data-effect="parallax"] {
    --range: 300;
    --translate: calc((var(--range) * -1px) + (var(--range) * 2px) * var(--progress, 0));

    translate: 0 var(--translate);
  }

  [data-effect="clip"] {
    clip-path: inset(calc((1 - var(--progress)) * 30%));
  }

  [data-scrub="textClipIn"] {
    color: transparent;
    background-image: linear-gradient(90deg, #000 50%, #ccc 50%, #ccc 100%);
    background-position: calc(100% * (1 - var(--progress))) 0;
    background-clip: text;
    background-size: 200% 100%;
  }
}

```

```html
<figure class="h-screen overflow-hidden" data-scrub data-start="1" data-end="-1">
  <img
    src="pizza.jpg" class="h-full w-full object-cover" alt="" decoding="async" loading="lazy" data-effect="parallax"
  />
</figure>
```


## コールバック

Orerollの3つ目の引数はコールバック関数を受け取ることができます。


```javascript
const callBack = (entry, isInView, progress) => {
  if (isInView) {
    console.log(`トリガー要素がビューポートに入った`)
  } else {
    console.log(`トリガー要素がビューポートから出た`)
  }
}

new Oreroll('[data-trigger]', { rootMargin: '0px 0px -30%' }, callBack);
```

### コールバック関数の引数

#### entry
型： IntersectionObserverEntry



#### isInView
型: boolean

トリガー要素がビューポート内であれば `true` そうでなければ `false`


#### progress
型 : number | undefined

スクラブ機能を利用時の現在の進捗度
