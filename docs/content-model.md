# コンテンツモデル実装メモ

この文書は、Accessible Design Guideの原稿を更新する人がfrontmatterと中央参照データの役割を確認するためのメモです。

## 共通方針

- Starlight標準の`title`をページタイトルに使用する。
- pilot原稿の`summary`はStarlight標準の`description`へ移し、重複保持しない。
- すべてのドキュメントで`contentType`を指定する。
- `contentType`は`page`、`lens`、`practice`のいずれかとする。
- Practiceだけが必要とする項目は、`contentType: practice`のときだけ必須になる。

## Practice

Practice IDは一般的な`id`と区別するため、frontmatterでは`practiceId`を使用する。

```yaml
contentType: practice
practiceId: OP-01
title: ひとつの操作方法だけに頼らない
description: 特定の入力方法だけを使えることを前提にせず、異なる操作方法でも同じ目的を達成できるように設計します。
primaryLens: operate
priority: standard
condition: always
phases:
  decide: primary
  design: primary
  review: primary
wcag:
  - "2.1.1"
```

- `priority`はLoftworkとしての品質判断であり、WCAG Levelから導出しない。
- `condition`は適用条件であり、`priority`とは別に管理する。
- WCAGの名称とLevelはfrontmatterへ書かず、`src/data/wcag.ts`から取得する。
- Lensの正式な参照情報は`src/data/lenses.ts`で管理する。

## 生成される表示

- Practiceページのタイトル直後に表示されるメタデータは、Starlightの`PageTitle`拡張がfrontmatterから生成する。
- LensとPractices一覧は`PracticeList.astro`が生成する。
- Decide、Design、Reviewの一覧は同じPracticeデータをフェーズで絞り込んで生成する。
- フェーズ別一覧は`primary`、`supporting`、Practice IDの順で並ぶ。
- WCAGの表と参照一覧は、IDを使って`src/data/wcag.ts`から名称とLevelを解決する。

このため、Practice本文、Lens本文、フェーズ別ページへPracticeの説明文をコピーしない。

## 未収録のLens

pilot原稿では`navigate`、`adapt`、`perceive`、`recover`、`understand`が関連Lensとして参照されているが、正式な名称、順序、問いは提供されていない。

そのため、現在は有効なIDとしてのみ管理し、正式な参照データを推測で追加しない。
