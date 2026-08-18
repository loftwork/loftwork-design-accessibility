# Codex Handoff

## 実装の正本

`practice-master.json`を構造化事実の唯一の正本として使用してください。既存MD/MDXのfrontmatterと競合した場合はMasterを優先します。

本文のSummary / Body / Consider / ExploreはPracticeのMD/MDXに残します。Masterから本文を生成したり、本文をMasterへ複製したりしません。

## 推奨実装順序

1. `practice-master.schema.json`を型・Schemaの基準にする
2. `practice-master.json`をbuild時に読み込む
3. 既存のWCAG中央参照データをA/AA 55基準へ拡張する
4. Practice本文を`id`でMasterへjoinする
5. Badge、Lens一覧、By Phase、WCAG表、Requirement表示、Handoff表示をMasterから生成する
6. OP-10本文ページを追加し、OP-01から4.1.2を外す
7. NV-06をAlways表示へ変更する
8. Build前に`validate.mjs`相当の検査を実行する

## 表示ルール

- WCAG LevelとRequirementは別のBadge/ラベルで表示する
- `primary` / `supporting`は内部データとして保持し、表示語は読者向けに翻訳できる
- Related LensではCanonical本文を複製せずリンクする
- `development`は「開発へ引き継ぐ」と表示する
- Handoffは責任移譲ではなく、意図を実装で維持する必要を表す
- Conditionalは該当機能・コンテンツがある場合だけ表示・抽出できるようにする

## 受け入れ条件

- 51件すべてが表示または参照可能
- Lens別件数が`9 / 6 / 7 / 10 / 6 / 8 / 5`
- By PhaseがMasterの`primary` / `supporting`から生成される
- WCAG A 31件、AA 24件の逆引きにCoverage gapがない
- OP-01は2.1.1のみ、OP-10は4.1.2
- NV-06はAlways
- Conditional全件に`appliesTo`がある
- Baseline 37件、Project-dependent 14件
- Validatorがerrors 0で完了する

## 実装しないこと

- Pilot frontmatterを正本として継続する
- WCAG Levelから公開時にRequirementを都度再計算する
- 本文へBadgeやWCAG表を手書きで重複保持する
- Related Lensごとに同じPractice本文を複製する
- Handoffを「開発担当だけの責任」と解釈する

