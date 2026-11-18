# さんすうスペースラボ（sansu6）

算数の単元を、見て・さわって・かいて理解する学習アプリ。アドバイザーは うさとろ（えいたんエイリアン 001 を流用）。
いまの単元：6年「拡大図と縮図」

- あそぶ：`index.html` を開く ／ 1ファイル版 `dist/sansu6.html`（Canva・直接配布用、約0.4MB）
- 仕様書：`SPEC.md`　UIサンプル：`sample/ui-sample.html`

## ファイル
| ファイル | 中身 |
|---|---|
| js/core.js | 画面切替・オートセーブ・効果音・うさとろの吹き出し・図形の描画・テンキー |
| js/engines.js | 画面と問題の型（単元えらび／単元ホーム／ステージ／しる／えらぶ／みわける／かく／もとめる／テスト／けっか／せってい） |
| units/kakudai.js | 単元「拡大図と縮図」の中身 |
| se.js | 効果音（eitan から流用） |
| tools/build_font.py | 使う文字だけフォントを切り出す |
| tools/build_single.py | 1ファイル版を作る |

## 単元の足し方
1. `units/○○.js` を作り、`SANSU6.addUnit({ id, grade, title, intro, menus:[...] })` を書く
2. `index.html` の `<script src="units/kakudai.js">` の下に1行足す
3. `python3 tools/build_font.py <fontsourceのfiles> .` → `python3 tools/build_single.py .`

- しる（説明）は `slides:[{t, say, point, scene(c){...}}]` と `check:r=>[問題,...]`
- テストは メニューに `test:true`、ステージに `pass:8`
- 問題の型：`{kind:'pick', q, opts, ans}` ／ `{kind:'num', q, unit, ans, fig}` ／ `{kind:'choose', cands, follow}` ／ `{kind:'draw', org, k, mode}`
- どの問題も `hints:[...]`（ヒント2段階）と `explain`（まちがえたときの説明）を持てる
- セーブは 単元ID／メニューID／ステージID ごとなので、単元を足しても前のデータは消えない
