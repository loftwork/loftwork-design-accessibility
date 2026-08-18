# Content Model v1.0 実装メモ

## データの責務

### Practice Master

`content-source/practice-master-v1.0/practice-master.json`が構造化された事実の唯一の正本です。

- Practice IDと正式タイトル
- Primary / Related Lens
- Priority / Requirement
- Condition / appliesTo
- Decide / Design / Reviewの重み
- Development Handoff
- WCAG IDとLevel

一覧、Badge、メタデータ、逆引き表示はこのMasterから生成します。個別Markdownのfrontmatterへ同じ情報を手書きしません。

### Editorial Content

`content-source/editorial-content-v1.0/`が人が読む文章の正本です。

- Lens: Question、Why、Situations、Review、Explore
- Practice: Summary、Body、Consider、Explore

Practiceは`practiceId`、Lensは`lensId`でMasterへ結合します。Editorial原稿には正式タイトル、Lens分類、Phase、Requirement、Condition、Handoff、WCAGを重複保持しません。

### WCAG中央参照

`src/data/wcag.json`はWCAG 2.2 Level A 31基準、AA 24基準の英語原文名、WAIC日本語訳の表示名、Level、原則、参照URL用slugを保持します。画面上の達成基準名には`titleJa`を使用し、`title`の英語原文名は参照データとして保持します。

Master内のWCAG対応とLevelが中央参照データに一致し、55基準すべてに1件以上のPracticeが対応することを`validate-reference-data.mjs`で検証します。WCAG LevelとLoftworkのRequirementは別の分類として表示します。

## Starlightページの生成

`scripts/generate-content.mjs`は両Canonical Sourceを読み込み、`.generated/docs/`へStarlight用ページを生成します。

生成時にのみ次を付与・変換します。

- Master由来の`title`
- Editorial Summary由来のStarlight `description`
- LensのPractice一覧生成コンポーネント
- LensのWCAG表生成コンポーネント
- 日本語テキストに隣接したMarkdown強調記法のHTML正規化

Canonical Source自体は変更しません。`.generated/`はGit管理せず、`dev`、`check`、`build`の前に再生成します。

## 表示の生成元

| 表示 | 生成元 |
|---|---|
| Practiceタイトル、Badge、Lens、Phase、Condition、Requirement、Handoff | Practice Master |
| Practice本文、Summary、Consider、Explore | Editorial Content |
| Lens本文 | Editorial Content |
| Lens内Practice一覧 | Primary LensでMasterを抽出 |
| By Phase | Masterの`primary` / `supporting` |
| Lens Standards表 | Primary LensのPracticeに対応するWCAGを集約 |
| WCAG達成基準名 | WCAG中央参照のWAIC日本語訳タイトル |
| WCAG逆引き | WCAG中央参照とMasterを結合 |

## Validator

- `content-source/practice-master-v1.0/validate.mjs`
- `content-source/editorial-content-v1.0/validate.mjs`
- `scripts/validate-reference-data.mjs`
- `scripts/verify-build.mjs`

両Canonical Validatorと中央参照Validatorはページ生成・Astro buildより前に実行します。Build後は、51 Practice、7 Lens、Lens別・Phase別順序、WCAG 55基準、内部リンク、OP-01／OP-10／NV-06を生成HTMLで再確認します。
