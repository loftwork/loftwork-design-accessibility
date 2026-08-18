# Requirement Policy v1.0

## 基本方針

BaselineはWCAG Level Aの別名ではありません。

> WCAG 2.2 Level Aを基礎としつつ、ロフトワークがWeb制作の基本品質として重要だと考える一部のLevel AAもBaselineとする。

WCAG Levelは規格上のA/AAとして保持し、`requirement`はロフトワークの品質方針として別に保持します。

## Baseline

次に対応するPracticeをBaselineとします。

1. WCAG 2.2 Level A
2. 次の指定済みLevel AA 6基準

| WCAG | Practice |
|---|---|
| 1.4.3 Contrast (Minimum) | PE-07 |
| 1.4.10 Reflow | ST-05 |
| 1.4.11 Non-text Contrast | PE-08 |
| 2.4.7 Focus Visible | NV-06 |
| 2.4.11 Focus Not Obscured (Minimum) | NV-07 |
| 2.5.8 Target Size (Minimum) | OP-04 |

## Project-dependent

上記以外のLevel AAだけに対応するPracticeです。これは「やらなくてよい」ではありません。案件の要求レベル、対象ユーザー、機能、予算・スコープ等を踏まえて適用判断することを意味します。

## 判定順序

1. `requirements`に該当する明示Overrideがある場合はOverrideを使う
2. 対応基準にLevel Aがある場合は`baseline`
3. 指定AA 6基準のいずれかに対応する場合は`baseline`
4. その他のAA-only Practiceは`project-dependent`

サイト表示時に毎回Requirementを動的計算せず、Masterには確定値を書きます。Policyデータは、値の理由を説明し、Validatorで監査するために使います。

## 混在Practice

次のPracticeはA/AAが混在するためOverrideを持ちます。

- PE-04: 1.2.2 A / 1.2.4 AA
- PE-05: 1.2.3 A / 1.2.5 AA
- UN-05: 3.1.1 A / 3.1.2 AA

Practice全体のトップレベル`requirement`はBaselineです。個別基準の追加要求は`requirements`で区別します。

## 外部向け表現

公開時点で「全制作物がBaselineを満たす」と保証する宣言にはしません。運用成熟前は、次の趣旨で説明します。

> このガイドでは、WCAG 2.2 Level Aを基礎に、Web制作の基本品質として重要だと考える一部のLevel AAを「標準品質」として位置づけています。私たちは、これらをロフトワークのWeb制作における最低限の品質として扱える状態を目指します。

