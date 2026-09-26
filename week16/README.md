# 日記と、メモ。

カレンダーから日付を選んで日記を書き、日付に関係のない自由メモも残せるアプリです。
Vite + React + JavaScript + Tailwind CSS 4を使用します。
`.jsx`はJavaScriptにHTMLのような記法を加えたファイルで、TypeScriptではありません。

## 起動方法

プロジェクトのルート（my-profile13）から実行します。

```powershell
cd week16
pnpm run dev
```

表示されたURL（通常 http://localhost:5173/）をブラウザーで開きます。
カレンダーで日付を選び、日記を入力して「日記を保存」を押してください。
自由メモは「メモを保存」で別に保存します。保存済みの日には丸印が付きます。
日記を空欄で保存すると、その日の日記を削除します。
未保存の日記がある状態で別の日付を選ぶと、変更を破棄するか確認します。
月の切り替えだけでは、編集中の日付や入力内容は変わりません。
再読み込み前には保存ボタンを押してください。
終了はターミナルで Ctrl+C を押します。
別のPCなど、依存関係がまだない場合は先に `pnpm install --frozen-lockfile` を実行します。
構築時の環境は Node.js 24.15.0 / pnpm 11.1.2 です。

## ビルド

week16内で実行します。

```powershell
pnpm run build
```

公開用のHTML・JavaScript・CSSを `dist` に生成します。ビルド成功を確認済みです。
`pnpm run preview` で生成結果をローカル確認できます。

## ファイルの役割

| ファイル | 役割 |
| --- | --- |
| package.json | 必要なライブラリとdev・build・previewコマンドを定義。type: moduleでimport構文を使用し、packageManagerでpnpmのバージョンを明記します。 |
| pnpm-lock.yaml | 実際に使用する依存関係のバージョンを記録します。 |
| vite.config.js | ReactのJSX・更新反映とTailwindのCSS生成をプラグインで有効化。既存のbase: './'を引き継ぎ、出力の参照先を相対パスにします。 |
| index.html | ブラウザーが最初に読むHTML。Reactの表示先rootとmain.jsxを指定します。 |
| src/main.jsx | Reactをrootへ表示し、共通CSSを読み込みます。StrictModeは開発中の問題発見を助けます。 |
| src/App.jsx | 月別カレンダー、日付の選択、日記・メモの入力と保存、保存状態とエラーの表示です。 |
| src/index.css | Tailwindを読み込みます。source(".")でクラスの検索対象をsrc内に限定します。 |
| .gitignore | node_modules・distなどの生成物をGitの記録対象から外します。 |

Tailwind CSS 4のViteプラグイン方式なので、tailwind.config.jsやPostCSSの設定ファイルは不要です。
参考: https://tailwindcss.com/docs/installation/using-vite

## 今回実行した主なコマンド

- `node --version` / `pnpm --version`: 実行環境の確認。
- `pnpm install`: 当初のルートで不足していた依存関係を追加。
- `pnpm install --offline`: 作業先変更後、ルートの依存関係を復元。
- `pnpm install --offline --frozen-lockfile`: week16内にキャッシュから依存関係を配置。
- `pnpm run dev --host 127.0.0.1`: 開発サーバーの起動確認。
- `pnpm run build`: week16内の本番ビルド確認。

既存のTailwindのバージョンを引き継ぎ、不要なライブラリは追加していません。

## 理解しておきたいReact / JavaScript

### useState：画面の状態を覚える

表示中の月、選択日、保存済み日記、入力中の文章、メモなどを保持します。
`setDiaryText`などの更新関数を呼ぶと、Reactが変更後の値で画面を表示し直します。
`useState(loadSavedData)`は最初の表示時に保存データを読み込むための書き方です。

### 入力欄のvalueとonChange

`value={diaryText}`でReactの状態を入力欄に表示し、
`onChange`内の`event.target.value`で新しい入力を読み取ります。
入力中の文章と保存済みの文章は分けておき、保存ボタンを押したときだけ保存します。

### useEffect：選んだ日の日記を表示する

`useEffect(..., [selectedDate, diaries])`は選択日や保存済み日記が変わると実行されます。
`diaries[selectedDate] || ''`でその日の日記を読み取り、未記入の日なら空欄にします。

### Dateと配列：カレンダーを作る

- `new Date(year, month, 1).getDay()`：月初の曜日を取得（日曜が0、土曜が6）。
- `new Date(year, month + 1, 0).getDate()`：その月の末日を取得。うるう年にも対応。
- JavaScriptの月は0始まりなので、画面では`month + 1`を表示します。
- 月初の曜日の数だけ空欄を置き、`Array.from`と`map`で日付ボタンを表示します。
- `new Date(year, month + amount, 1)`で月を移動します。12月から1月への年越しもDateが計算します。
- Tailwindの`grid-cols-7`で日曜から土曜まで7列に並べます。

### localStorageとJSON：再読み込み後にも残す

日記は`week16-diaries`というキーに、次のような日付別のオブジェクトを保存します。

```js
{
  '2026-09-26': '今日の出来事',
  '2026-09-27': '次の日の出来事'
}
```

localStorageには文字列を保存するため、書き込み時は`JSON.stringify`、
読み込み時は`JSON.parse`で変換します。メモは`week16-memo`に文字列のまま保存します。
`{ ...diaries }`でコピーを作ってから更新し、Reactの状態を直接書き換えないようにしています。
`try / catch`で保存に失敗した場合のメッセージを表示し、入力内容は残します。

データは同じブラウザー・同じURLの保存領域に残ります。別端末への同期はしません。
ブラウザーのデータ削除で消えるため、重要な記録は別途控えてください。

### Tailwindによる画面幅への対応

基本は縦並びで、`lg:grid-cols-2`によりPCではカレンダーと入力欄を横に並べます。
`min-w-0`と`w-full`で幅に収め、`flex-wrap`で狭い画面のボタンや説明を折り返します。
外部API・データベース・追加ライブラリは使用していません。

## 動作確認結果

- `pnpm run build`：成功。
- Edgeで375pxと1280pxを確認：横にはみ出さず、縦並びと2列表示が切り替わる。
- 日付別の日記の保存・切り替え、日記ありの印、自由メモの保存：成功。
- 再読み込み後の日記・メモの復元：成功。
- 未保存の日記の移動確認、空欄保存による削除：成功。
- 2024年2月から14か月分の曜日配置・日数・年越し：成功。
- 保存エラー時のメッセージ表示と入力保持：成功。

検証には一時ブラウザープロファイルを使い、アプリの依存関係は追加していません。
