# Validation / Audit Report

## 結果

**PASS — errors 0**

```json
{
  "practices": 51,
  "lenses": 7,
  "wcagA": 31,
  "wcagAA": 24,
  "baselinePractices": 37,
  "projectDependentPractices": 14,
  "conditionalPractices": 28,
  "developmentHandoffs": 40
}
```

## 検査項目

| 検査 | 結果 |
|---|---|
| Practice数 = 51 | Pass |
| IDの一意性と形式 | Pass |
| PrefixとPrimary Lensの一致 | Pass |
| Lens別件数 9 / 6 / 7 / 10 / 6 / 8 / 5 | Pass |
| Related Lensが0〜2件、Primary自身を含まない | Pass |
| `priority = standard` | Pass |
| Requirement Policy v1.0との一致 | Pass |
| Conditionalに`appliesTo`がある | Pass |
| Alwaysに`appliesTo`がない | Pass |
| Phase語彙と最低1つのPrimary | Pass |
| Handoff語彙 | Pass |
| WCAG IDとLevel | Pass |
| WCAG 2.2 Level A 31基準のCoverage | Pass |
| WCAG 2.2 Level AA 24基準のCoverage | Pass |
| OP-01から4.1.2を削除 | Pass |
| OP-10が4.1.2を担当 | Pass |
| NV-06 = Always | Pass |

## WCAG Coverage

### Level A — 31/31

`1.1.1, 1.2.1, 1.2.2, 1.2.3, 1.3.1, 1.3.2, 1.3.3, 1.4.1, 1.4.2, 2.1.1, 2.1.2, 2.1.4, 2.2.1, 2.2.2, 2.3.1, 2.4.1, 2.4.2, 2.4.3, 2.4.4, 2.5.1, 2.5.2, 2.5.3, 2.5.4, 3.1.1, 3.2.1, 3.2.2, 3.2.6, 3.3.1, 3.3.2, 3.3.7, 4.1.2`

### Level AA — 24/24

`1.2.4, 1.2.5, 1.3.4, 1.3.5, 1.4.3, 1.4.4, 1.4.5, 1.4.10, 1.4.11, 1.4.12, 1.4.13, 2.4.5, 2.4.6, 2.4.7, 2.4.11, 2.5.7, 2.5.8, 3.1.2, 3.2.3, 3.2.4, 3.3.3, 3.3.4, 3.3.8, 4.1.3`

WCAG 2.2では4.1.1 Parsingはobsolete and removedのため、A Coverage対象に含めません。

## 外部標準照合

2026-08-18にW3CのWCAG 2.2 Recommendationを確認しました。

- https://www.w3.org/TR/WCAG22/
- W3C Recommendation: 12 December 2024
- 4.1.1 Parsingはobsolete and removed
- 本Masterが対象とするA/AA基準のIDとLevelに不一致なし

## 警告（解決済み・非ブロッキング）

### appliesTo schema completion

Freeze済みの19語だけでは、承認済みのNV-04、NV-07、OP-05、OP-07、OP-08、OP-09のConditionalを正確に表せません。意味を別条件へ丸めず、6語を明示的に追加しました。追加語は`practice-master.json`で基本語彙と分離して管理しています。

### Requirement Override selector

Freeze時の`requirements`例は`appliesTo` selectorでした。PE-05とUN-05は同じ適用条件の中でA/AAが分かれるため、`wcag` selectorをschema completionとして許容しました。Coverage/Requirementの分離方針を維持するための補完であり、Practiceの要求レベルは変更していません。

## 再現方法

```sh
node practice-master-v1.0/validate.mjs
```

