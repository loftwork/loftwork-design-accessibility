# Pilot repository → Practice Master v1.0

## 参照した実装

- Repository: `loftwork/loftwork-design-accessibility`
- Commit: `b104fe4487e231af0870c27a8b2794a98344ab0c`
- Default branch: `main`

パイロット実装で確認できたPractice本文ファイルは`src/content/docs/practices/op-01.md`〜`op-08.md`の8件です。リポジトリ内のContent Modelは、`practiceId / primaryLens / relatedLens / priority / condition / appliesTo / phases / wcag`をfrontmatterに保持しています。

パイロットには次が未実装です。

- 7 Lensの完全な正式体系
- 51 PracticesのMaster
- `requirement` / `requirements`
- Requirement Policy v1.0
- `handoff`
- Freeze済み`appliesTo` controlled vocabulary
- 全A/AA Coverage validator
- OP-09 / OP-10
- 7 Lens全体のEditorial Content

したがって、リポジトリの8件を51件の正本と見なさず、会話で承認済みの50件体系へGitHubのID、タイトル、本文、実装パターンを対応付け、OP-10を加えています。

## 必須Change Set

### Practice数

- Before: 会話で確定した50件体系。GitHub上の実ファイルは8件
- After: 51件
- Added: OP-10
- Removed: なし
- Merged: なし

### OP-01 / OP-10

パイロットのOP-01はWCAG 2.1.1と4.1.2を参照しています。v1.0では責務を分離します。

| Practice | v1.0 WCAG |
|---|---|
| OP-01 ひとつの操作方法だけに頼らない | 2.1.1 A |
| OP-10 UIの役割と状態を明確にする | 4.1.2 A |

### NV-06

- Before: `conditional`
- After: `always`

一般的なWebサイトには通常フォーカス可能要素が存在するためです。`appliesTo: keyboard-operable-ui`は削除します。

### Content Model

- Before: Pilot model
- After: Content Model v0.4
- Added: `requirement`, `requirements`, `handoff`
- Formalized: Related Lens、Phase weight、Condition / appliesTo、Development Handoff

### Requirement Policy

- Before: WCAG LevelとPriority/適用判断の分離が未完成
- After: Requirement Policy v1.0
- Baseline: Level A + 指定AA 6基準
- Project-dependent: その他AA

## Pilot frontmatterの移行例

```yaml
# Pilot
practiceId: OP-01
primaryLens: operate
priority: standard
condition: always
phases:
  decide: primary
  design: primary
  review: primary
wcag:
  - "2.1.1"
  - "4.1.2"
```

```json
{
  "id": "OP-01",
  "primaryLens": "operate",
  "priority": "standard",
  "requirement": "baseline",
  "condition": "always",
  "phases": {
    "decide": "primary",
    "design": "primary",
    "review": "primary"
  },
  "handoff": ["development"],
  "wcag": [{ "id": "2.1.1", "level": "A" }]
}
```

4.1.2はOP-10へ移します。

## 実装時に残すもの

- 既存のStarlight/Astro構成
- `contentType`によるContent分類
- MD/MDX本文とfrontmatterの読み込み
- Practice一覧、By Phase、WCAG表を中央データから生成する考え方
- WCAG名・Level・URLを中央参照データで解決する設計

## 実装時に置き換えるもの

- 個別frontmatterを構造化事実の正本にしない
- Badge、WCAG、Lens、Phaseを本文へ手書きしない
- `src/data/wcag.ts`の限定的な11基準型を、WCAG 2.2 A/AA 55基準へ拡張する
- `recover`等、Freeze済み7 Lensに存在しない旧Related Lens IDを移行する

