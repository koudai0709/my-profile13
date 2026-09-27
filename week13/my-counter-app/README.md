# POSSE Week13 カウンター

Vite（Vanilla JS）・pnpm を使用。

## 起動

```sh
cd week13/my-counter-app
pnpm install
pnpm run dev
```

## 機能

- +1・-1・リセット
- 応用：+5・-5、正の数は青・負の数は赤
- 中央配置、ボタンのホバー・クリック時のアニメーション

## 構成

- `index.html`：Viteのエントリー
- `src/app.html`：画面のHTML
- `src/main.js`：読み込みと初期化
- `src/counter.js`：カウント処理
- `src/style.css`：スタイル
- `vite.config.js`：`base: './'`

`pnpm run build` でビルド、`pnpm run preview` で確認できます。

