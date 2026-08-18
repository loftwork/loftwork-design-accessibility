# Accessible Design Guide

Loftworkのデザインアクセシビリティを、7つのHuman Lensと51件のPracticeから考えるAstro Starlight製ドキュメントサイトです。

## 収録内容

- 7つのHuman Lens
- 51件のPractice
- Decide、Design、Reviewのフェーズ別一覧
- WCAG 2.2 Level A・AA 55基準からの逆引き
- Requirement、Condition、Related Lens、Development Handoffの表示

## Canonical Source

- 構造化データ: `content-source/practice-master-v1.0/practice-master.json`
- Editorial Content: `content-source/editorial-content-v1.0/lenses/`、`practices/`
- WCAG中央参照（W3C英語原文名・WAIC日本語訳タイトル）: `src/data/wcag.json`

Practice Masterは、ID、正式タイトル、Lens、Phase、Requirement、Condition、Handoff、WCAG対応のSingle Source of Truthです。Editorial Contentは`practiceId` / `lensId`でMasterへ結合します。

`.generated/`以下のStarlightページはbuild前に生成される派生物です。直接編集しないでください。

詳細は[`docs/content-model.md`](docs/content-model.md)を参照してください。

## 必要な環境

- Node.js 24
- npm

## ローカル開発

```sh
npm install
npm run dev
```

`npm run dev`の前に、両Canonical ValidatorとWCAG中央参照Validatorを実行し、Starlightページを生成します。

## 検証とビルド

```sh
npm run check:all
```

次を順番に確認します。

1. Practice Master Validator
2. Editorial Validator
3. WCAG中央参照Validator
4. 51 Practice・7 Lensページの生成
5. Astro型検査
6. 静的サイトBuild
7. ページ数、一覧順序、WCAG逆引き、内部リンク、主要Freeze変更の検証

個別には次のコマンドを使用できます。

```sh
npm run validate:content
npm run generate:content
npm run check
npm run build
npm run verify
```

## GitHub Pages

GitHub Actions上では標準で以下を使用します。

- `site`: `https://loftwork.github.io`
- `base`: `/loftwork-design-accessibility`

`main`ブランチへのpushで`.github/workflows/deploy.yml`が`npm run check:all`を実行し、成功した成果物を公開します。カスタムドメインへ移行する場合は、ビルド環境の`SITE_URL`と`BASE_PATH`で変更できます。
