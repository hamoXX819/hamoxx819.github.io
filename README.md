# Hamoi Portfolio

このリポジトリは個人のポートフォリオサイトです。
シンプルな静的サイト（HTML/CSS/JavaScript）で構成されています。

## 概要
- 自己紹介・技術スタック・制作物を掲載しています。
- ダークモード、レスポンシブ、ハンバーガーメニュー、簡易アニメーションを実装済み。

## 使い方（ローカルで確認）
1. このフォルダをクローンまたは取得します。
2. ブラウザで `index.html` を開くだけで動作確認できます。
   - コマンドラインで簡易サーバを使う場合（推奨）:

```bash
# Python 3 の場合
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## 開発
- 主なファイル:
  - `index.html` — ページ本体
  - `style.css` — スタイル
  - `script.js` — UI 振る舞い（メニュー・テーマ・アニメーション）
  - `images/yusha_hamoi.svg` — プロフィール画像（SVG）
  - `images/yusha_hamoi.png` — OGP画像

## 注意点
- 機密情報（`.env` 等）は `.gitignore` に追加済みです。既にコミット済みの機密情報がある場合は、履歴からの除去（BFG や `git filter-repo`）を検討してください。

## デプロイ
- 静的ホスティング（GitHub Pages、Netlify、Vercel など）に配置できます。
- ビルド手順は特に不要です（そのまま配信可能）。

## 連絡
- GitHub: https://github.com/hamoXX819
- メール: README に記載のメールリンク（`index.html` の連絡ボタン）を使用してください。

---

（必要なら README を英語版や詳細なデプロイ手順で拡張します。ご希望を教えてください。）
