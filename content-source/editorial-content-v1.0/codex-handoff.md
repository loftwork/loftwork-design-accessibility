# Codex Handoff — Editorial Content v1.0

## 入力

- `practice-master-v1.0/practice-master.json`
- `practice-master-v1.0/practice-master.schema.json`
- `editorial-content-v1.0/lenses/*.mdx`
- `editorial-content-v1.0/practices/*.md`

## 結合キー

- Practice: `practiceId`
- Lens: `lensId`

正式タイトルとメタデータはMasterから取得してください。Editorial Contentのfrontmatterへコピーしないでください。

## 移行手順

1. Masterをbuild時の構造化データとして読み込む
2. Practice本文を`practiceId`でMasterへjoinする
3. Lens本文を`lensId`でMasterへjoinする
4. `PRACTICE_LIST`マーカーを、Primary Lensで抽出したPractice一覧へ置き換える
5. `WCAG_TABLE`マーカーを、MasterのWCAG対応から生成した表へ置き換える
6. Badge、Related Lens、Phase、Requirement、Condition、HandoffをMasterから表示する
7. WCAG名・Level・公式URLを中央参照データから解決する
8. Master ValidatorとEditorial Validatorをbuild前に実行する

## パイロットからの更新

- 既存OP-01〜08の本文はこのパッケージ版へ置き換える
- OP-09とOP-10を追加する
- OP-01の表示WCAGはMasterに従い2.1.1だけにする
- 4.1.2はOP-10へ表示する
- Lens `operate`のPractice一覧を8件固定から10件のMaster生成へ変更する
- 残り6 Lensと42 Practiceを新規に組み込む

## 受け入れ条件

- 51 Practice本文と7 Lens本文がjoinできる
- MasterにもEditorial Contentにも欠落・孤立IDがない
- タイトルやWCAG情報を本文側へ重複保持していない
- 7 LensすべてにQuestion / Why / Situations / Review / Exploreがある
- 51 PracticeすべてにSummary / Body / Consider / Exploreがある
- 内部ChatGPT引用記号やwriting-block fenceが公開本文に残らない
- 両Validatorが`status: pass`で完了する

