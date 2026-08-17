# Accessible Design Guide

Loftworkのデザインアクセシビリティの視点に関する、Astro Starlight製のドキュメントサイトです。

現在は、Human Lens 4「操作する」と8件のPracticeを使って、コンテンツモデルと読み心地を検証するプロトタイプです。

収録内容は以下です。

- Human Lens 4「操作する」
- OP-01からOP-08までの8件のPractice
- Decide、Design、Reviewのフェーズ別一覧
- Lens 4で参照するWCAG 2.2達成基準

## 必要な環境

- Node.js 24
- npm

## ローカル開発

```sh
npm install
npm run dev
```

## 検証とビルド

```sh
npm run check:all
```

型、ビルド、必要なページ、Practiceの件数と順序、内部リンクをまとめて確認します。生成されたサイトは`dist/`へ出力されます。

## コンテンツの更新

- 公開する原稿は`src/content/docs/`へ追加します。
- Practice一覧とフェーズ別一覧はfrontmatterから自動生成されます。
- WCAGの日本語名、Level、WAIC日本語訳への参照先は`src/data/wcag.ts`で一元管理します。
- Practice本文へメタデータ表示を重複して書く必要はありません。

## GitHub Pagesのパス

GitHub Actions上では、標準で以下を使用する構成です。

- `site`: `https://loftwork.github.io`
- `base`: `/loftwork-design-accessibility`

`main`ブランチへpushすると、GitHub Actionsが検証・ビルドを行い、次のURLへ自動公開します。

- `https://loftwork.github.io/loftwork-design-accessibility/`

GitHubのリポジトリ設定では、`Settings` → `Pages` → `Build and deployment` → `Source`を`GitHub Actions`にします。手動で再公開するときは、Actionsの`Deploy to GitHub Pages`を実行します。

カスタムドメインへ移行するときは、ビルド環境の`SITE_URL`と`BASE_PATH`で変更できます。

## コンテンツモデル

frontmatterと中央参照データの方針は[`docs/content-model.md`](docs/content-model.md)を参照してください。
