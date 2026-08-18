# Editorial Policy v1.0

## MasterとEditorial Contentの分離

Practice Masterは構造化された事実、Editorial Contentは人が読む文章です。

Editorial Contentへ次を重複保持しません。

- 正式タイトル
- Primary / Related Lens
- Priority / Requirement
- Condition / appliesTo
- Phase
- Handoffの有無
- WCAG ID / Level /表示名

これらはPractice Masterから表示します。

Editorial Contentが保持するのは次です。

### Lens

- Question
- Why
- Situations
- Review
- Explore

Practices一覧とStandards表は生成マーカーの位置へMasterから挿入します。

### Practice

- Summary
- Body
- Consider
- Explore
- 必要な場合のみ「開発へ引き継ぐ」の説明

## 文体

- WCAGの達成基準名をPracticeタイトルへ直接使わない
- 「対象 + 制作時の判断」を日本語の動詞で示す
- 実装方法の詳細ではなく、IA・デザイン時の判断を説明する
- 障害種別だけに限定せず、Permanent / Temporary / Situational / Environmentへ広げる
- 違反箇所探しだけで終わらず、Exploreで改善の可能性を問いかける

## Standardsとの境界

Bodyでは、WCAGが求める意図をデザイン上の判断へ翻訳できます。ただし、基準ID、Level、名称、URLはMasterとWCAG中央参照データから生成します。

内部ChatGPT引用記号は公開原稿へ残しません。外部参照が必要な場合は、Codex実装側のWCAG中央参照データから公式URLを提示します。

## Development Handoff

Handoff Badgeの有無はMasterが正本です。Editorial Contentに「開発へ引き継ぐ」節がある場合も、責任を開発者へ移す意味ではありません。IAやデザインで決めたアクセシビリティ上の意図を、実装でも維持するための説明です。

すべてのHandoff対象に同じ定型文を自動挿入しません。具体的に渡す内容がある場合だけ、短い説明をEditorial Contentへ追加します。

