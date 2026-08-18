# Loftwork Accessible Design Guide — Editorial Content v1.0

このパッケージは、Practice Master v1.0と結合して使う、7 Lensおよび51 Practiceの公開用Editorial Contentです。

## 内容

- `lenses/` — 7 LensのQuestion / Why / Situations / Review / Explore
- `practices/` — 51 PracticeのSummary / Body / Consider / Explore
- `source-manifest.json` — 各ファイルの出典TierとSHA-256
- `editorial-index.md` — 7 Lens・51 Practiceのレビュー用一覧
- `editorial-policy.md` — Masterとの責務分離と編集ルール
- `codex-handoff.md` — パイロット実装への組み込み手順
- `validate.mjs` — Practice MasterとのID整合、構造、出典Tierを検証
- `validation-report.md` — 検証・監査結果

## 依存関係

このパッケージは、隣接する`practice-master-v1.0/practice-master.json`を構造化された正本として参照します。

- ID、正式タイトル、Lens、Requirement、Condition、Phase、Handoff、WCAG: Practice Master
- Question、Why、Situations、Summary、Body、Consider、Explore: Editorial Content

同じ情報を両方へ重複保持しません。

## Canonical Sourceの優先順位

1. 参照会話で承認・Freezeされた正式原稿
2. 同会話で承認済みのPractice定義と編集方針
3. GitHubパイロット実装
4. W3C公式資料を用いた、承認済み定義の不足箇所の補完

## 出典の内訳

- 会話から正式原稿を回収: 42 Practice + 6 Lens
- GitHubパイロット本文をv1.0形式へ構造変換: OP-01〜OP-08
- GitHubパイロットLensをMasterへ整合: Lens `operate`
- 会話で承認済みの定義から正式原稿を補完: OP-09

OP-10は会話で承認された正式原稿を使用しています。

## 検証

```sh
node editorial-content-v1.0/validate.mjs
```

別の場所にMasterを置く場合は、第1引数にパスを渡します。

```sh
node editorial-content-v1.0/validate.mjs path/to/practice-master.json
```
