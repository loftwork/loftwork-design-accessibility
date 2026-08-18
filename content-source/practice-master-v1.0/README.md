# Loftwork Accessible Design Guide — Practice Master v1.0

このパッケージは、51 Practicesの構造化されたSingle Source of Truthと、Codex実装へ渡すためのContent Model、Requirement Policy、移行・監査情報をまとめたものです。

## 成果物

- `practice-master.json` — 51 Practicesの正本データ
- `practice-index.md` — 人がレビューするための51件一覧（派生表示）
- `practice-master.schema.json` — JSON Schema
- `validate.mjs` — ID、語彙、Policy、WCAG Coverage、Freeze済み変更を検査するValidator
- `content-model-v0.4.md` — フィールド定義と運用ルール
- `requirement-policy-v1.0.md` — Baseline / Project-dependentの判定ルール
- `migration-notes.md` — GitHubパイロットからv1.0への移行差分
- `validation-report.md` — 検証結果と監査判断
- `codex-handoff.md` — 実装順序と受け入れ条件

## Canonical Sourceの優先順位

1. 参照会話でFreezeされた最新の設計・ルール・承認済み原稿
2. 同会話で以前確定したPracticeのID・名称・本文
3. GitHub `loftwork/loftwork-design-accessibility` のパイロット実装
4. `loftwork_accessible_design_content_design_v0_1.docx` の初期設計

GitHubは実装構造とパイロット原稿の参照元であり、内容上の正解を決めるCanonical Sourceではありません。

参照したGitHubスナップショットはcommit `b104fe4487e231af0870c27a8b2794a98344ab0c` です。

## 重要な設計境界

`practice-master.json`は構造化された事実だけを保持します。Summary / Body / Consider / ExploreなどのEditorial Contentは重複格納しません。各Practiceの本文はMD/MDX側に一度だけ置き、Badge、Lens一覧、Phase一覧、WCAG表、Requirement表示、Handoff表示はMasterから生成します。

## 検証

```sh
node practice-master-v1.0/validate.mjs
```

期待結果は`status: pass`です。警告は、Freeze済みの条件を欠落なく表すために追加した6つの`appliesTo` schema-completion語彙についてのみ発生します。詳細は`content-model-v0.4.md`と`validation-report.md`を参照してください。
