# Validation / Audit Report

## 結果

**PASS — errors 0**

```json
{
  "practices": 51,
  "lenses": 7,
  "files": 58,
  "sourceTiers": {
    "canonical-conversation": 48,
    "pilot-repository-adapted": 8,
    "canonical-conversation-completed": 1,
    "pilot-repository-aligned": 1
  }
}
```

## 検査項目

| 検査 | 結果 |
|---|---|
| Practice本文ファイル = 51 | Pass |
| Lens本文ファイル = 7 | Pass |
| Practice MasterとのID完全一致 | Pass |
| 孤立・重複・欠落IDなし | Pass |
| Practice全件にSummary / Body / Consider / Explore | Pass |
| Lens全件にQuestion / Why / Situations / Practices / Review / Explore / Standards | Pass |
| Practice一覧・WCAG表の生成マーカー | Pass |
| 正式タイトルをEditorial側へ重複保持していない | Pass |
| 内部ChatGPT引用記号なし | Pass |
| writing-block fenceなし | Pass |
| 出典Tier件数 | Pass |
| Source Manifest SHA-256 | Pass |

## Provenance監査

### Canonical conversation — 48 files

- 42 Practice
- 6 Lens

参照会話で承認された正式原稿から、本文セクションを回収しました。内部ChatGPT引用記号、メタデータ行、手書きStandards表は除去し、Masterから生成する構造へ変換しています。

### Pilot repository adapted — 8 files

- OP-01〜OP-08

参照会話の読み取り可能範囲では完全な正式Practice本文を回収できなかったため、Canonical Source優先順位に従い、GitHubパイロット本文を使用しました。Summary / Body / Consider / Explore構造へ変換し、正式タイトル・WCAG・Condition等はMaster側へ分離しています。

### Canonical conversation completed — 1 file

- OP-09

会話で承認されたID、正式タイトル、Conditional、適用条件、WCAG 2.1.4対応を基礎に、W3C Understandingの意図を確認して正式原稿へ補完しました。

参照: https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html

### Pilot repository aligned — 1 file

- Lens `operate`

GitHubパイロットのLens本文を使用し、Practice一覧とStandards表をMaster生成マーカーへ置き換えました。Practice数やWCAG対応は本文へ固定していません。

## 非ブロッキング警告

次の3点は`validate.mjs`でも警告として表示します。

1. OP-01〜08はパイロット本文をv1.0構造へ適合させたもの
2. OP-09は承認済み定義から補完した正式原稿
3. Lens `operate`はパイロット本文をMasterへ整合させたもの

いずれも出典TierとSHA-256を`source-manifest.json`へ記録済みです。Codex実装を止めるエラーではありません。

## 再現方法

```sh
node editorial-content-v1.0/validate.mjs
```

