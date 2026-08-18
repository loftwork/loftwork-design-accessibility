# Content Model v0.4

## 目的

Practice Masterを、ID、分類、適用条件、制作Phase、WCAGトレーサビリティのSingle Source of Truthとして使います。人が読む本文はMD/MDXに置き、Masterへコピーしません。

## Practice fields

| Field | 必須 | 意味 |
|---|---:|---|
| `id` | Yes | `PE-01`等の不変ID。PrefixはPrimary Lensと一致させる |
| `title` | Yes | WCAG名ではなく、制作時の判断を日本語の動詞で示す正式名称 |
| `primaryLens` | Yes | Practice本文を置く唯一のLens |
| `relatedLens` | Yes | 別の問いから参照する価値が明確なLens。0〜2件 |
| `priority` | Yes | v1.0は全件`standard` |
| `requirement` | Yes | `baseline` / `project-dependent` |
| `requirements` | No | 条件またはWCAG基準単位のRequirement Override |
| `condition` | Yes | `always` / `conditional` |
| `appliesTo` | Conditionalのみ | 発火条件。Controlled vocabularyから1件以上 |
| `phases` | Yes | `decide` / `design` / `review`の重み |
| `handoff` | Yes | 後工程へ維持すべき意図。現在は`development`のみ |
| `wcag` | Yes | WCAG 2.2達成基準IDとLevel |

## Lens

| ID | 表示名 | Prefix | Practice数 |
|---|---|---:|---:|
| `perceive` | 見る・知覚する | PE | 9 |
| `structure` | 構造を理解する | ST | 6 |
| `navigate` | 移動する・見つける | NV | 7 |
| `operate` | 操作する | OP | 10 |
| `understand` | 理解する・予測する | UN | 6 |
| `input` | 入力する・失敗から戻る | IN | 8 |
| `adapt` | 自分の状況に合わせる | AD | 5 |

Primary LensだけがCanonicalな所在地です。Related Lens側はリンクまたは参照表示にし、本文を複製しません。Related Lensは「多少関係がある」だけでは付与せず、Primary Lens自身を含めません。

## Requirement

`requirement`はロフトワークの案件品質としての要求レベルであり、WCAG Levelとは別軸です。表示上もWCAG A/AAとBaseline/Project-dependentを混同しません。

複数基準を持つPracticeで要求レベルが混在するときだけ`requirements`を使います。

```json
{
  "requirement": "baseline",
  "requirements": [
    {
      "wcag": ["1.2.2"],
      "appliesTo": ["prerecorded-video"],
      "requirement": "baseline"
    },
    {
      "wcag": ["1.2.4"],
      "appliesTo": ["live-video"],
      "requirement": "project-dependent"
    }
  ]
}
```

Freeze時の例は`appliesTo`によるOverrideでした。ただしPE-05とUN-05は同じ適用条件の中でA/AAが分かれるため、v1.0では`wcag` selectorも許容します。これは承認済みのCoverage/Requirement分離を欠落なく表すためのschema completionです。

## Condition / appliesTo

`always`は、一般的なWebページを設計する時点で確認対象になるPracticeです。`conditional`は、特定のコンテンツ、UI、機能が存在するときだけ発火します。

- `conditional`には必ず`appliesTo`を1件以上設定する
- `always`には`appliesTo`を設定しない
- 「多くの案件にある」ことと`always`は同義ではない

Freeze済みの基本語彙は`practice-master.json`の`vocabulary.appliesToBase`に保持しています。

承認済みPracticeの条件を既存語彙へ無理に丸めず保持するため、次の6語を`appliesToSchemaCompletion`として追加しています。

| 追加語彙 | 対象Practice | 理由 |
|---|---|---|
| `multi-page-site` | NV-04 | 複数ページ集合にだけ適用される |
| `fixed-or-overlapping-ui` | NV-07 | 固定・重複UIがある場合だけ発火する |
| `pointer-action` | OP-05 | Pointer Cancellationの適用対象をGestureと混同しない |
| `motion-actuation` | OP-07 | 身体・端末の動きによる起動を表す |
| `complex-interaction` | OP-08 | Modal等、フォーカス移動・終了・復帰を設計するUIを表す |
| `character-key-shortcut` | OP-09 | 1文字ショートカットがある場合だけ発火する |

これらはPractice内容やPolicyを変更せず、既に承認されたConditionalを機械可読にするための補完です。

## Phase

```json
{
  "phases": {
    "decide": "primary",
    "design": "supporting",
    "review": "primary"
  }
}
```

- `primary` — そのPhaseで主体的に判断する
- `supporting` — そのPhaseでも意識・確認する価値がある
- `null` — 原則、そのPhaseの主要確認対象ではない

全Practiceは少なくとも1つの`primary`を持ちます。Roleではなく「いつ判断するか」で分類し、By PhaseページはMasterから生成します。

## Development Handoff

`handoff: ["development"]`は責任を開発者へ移す印ではありません。IA/Designで決めたアクセシビリティ上の意図が、実装方法によって成立または失われ得るため、開発工程でも維持する必要があることを示します。

本文にHandoff説明を持つ場合も、HTML/CSS/ARIAの実装解説へ踏み込みません。詳細実装はCoding Guideline側へ委ねます。

## Editorial分離

Masterへ次を持たせません。

- Summary
- Body
- Consider
- Explore
- WCAGの表示名・解説本文
- Badge用の重複文字列

WCAG名・Level・参照URLは中央のWCAG参照データから解決します。

