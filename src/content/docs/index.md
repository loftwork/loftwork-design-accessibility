---
title: 人の違いを、制作のはじめから考える
description: 人の違いを起点に、アクセシブルなWebデザインを制作のはじめから考えるためのガイドです。
contentType: page
---

私たちは、無意識に自分の見え方、理解の仕方、操作の仕方を基準にデザインしています。

でも、人がWebを使う方法や、そのとき置かれている状況は一つではありません。

Accessible Design Guideは、人の違いからデザインを考え、その気づきを要件、情報設計、UI、コンテンツの具体的な判断につなげるためのガイドです。

<nav class="guide-intro-actions" aria-label="このガイドを読み始める">
  <a class="guide-intro-primary" href="./why/">
    <span>なぜ、人の違いから考えるのか</span>
    <small>このガイドの考え方を約3分で読む</small>
  </a>
  <a class="guide-intro-secondary" href="#気づきを制作の判断へ">ガイドから探す</a>
</nav>

## 自分の『使える』だけでは見えないもの

画面を見る。文章を読む。音を聞く。マウスや指で操作する。情報の意味を理解する。

Webを作るとき、私たちはこうしたことができる自分自身を、知らないうちに基準にしています。

けれど、人の状態や利用する環境は一定ではありません。

<div class="persona-spectrum">
  <section class="persona-spectrum__group" aria-labelledby="persona-seeing">
    <h3 id="persona-seeing">見る</h3>
    <ul>
      <li><span class="persona-spectrum__label">長期的な違い</span>視覚に長期的な違いがある</li>
      <li><span class="persona-spectrum__label">一時的な違い</span>目の調子が悪く、一時的に見えにくい</li>
      <li><span class="persona-spectrum__label">状況による違い</span>強い日差しの中で画面を見ている</li>
    </ul>
  </section>
  <section class="persona-spectrum__group" aria-labelledby="persona-operating">
    <h3 id="persona-operating">操作する</h3>
    <ul>
      <li><span class="persona-spectrum__label">長期的な違い</span>手や腕の使い方に長期的な違いがある</li>
      <li><span class="persona-spectrum__label">一時的な違い</span>腕を怪我している</li>
      <li><span class="persona-spectrum__label">状況による違い</span>子どもや荷物を抱え、片手しか使えない</li>
    </ul>
  </section>
</div>

これらは同じ状態ではありません。

けれど、人とデザインの組み合わせによって、似た使いにくさが生まれることがあります。

## 違いは、デザインの問いを増やす

人の違いを考えると、できる表現が減るように感じるかもしれません。

でも、違いを見ることで、それまで当たり前だと思っていた前提にも気づくことができます。

『なぜ、この人には使いにくいのだろう？』

『この操作は、本当にこの方法だけでなければならないだろうか？』

『別の伝え方や、別の使い方はないだろうか？』

そうした問いは、デザインを制限するだけでなく、新しい選択肢を考える入口にもなります。

### 靴を履くという前提から考え直す

2012年、脳性まひのある16歳のMatthew Walzerは、自分で身支度はできても、靴紐だけは両親に結んでもらう必要があるという困りごとをNIKEへ伝えました。

その声を起点に開発されたFlyEaseは、片手でも着脱しやすい靴として2015年に製品化され、その後も技術が展開されました。2021年には、手を使わずに着脱できるGO FlyEaseが発表されています。

ここで起きたのは、特定の人のために例外を加えることだけではありません。

**『靴を履くときには手を使う』という、それまでの前提そのものをデザインの対象にした**と捉えることができます。

人の違いは、これまで気づかなかった問いを見つける手がかりになります。

## 気づきを、制作の判断へ

このガイドでは、人の違いについて知るだけで終わりません。

<ol class="guide-steps">
  <li>
    <h3>1. 気づく — Human Lens</h3>
    <p>見る、構造を理解する、移動する、操作する、理解する、入力する、自分の状況に合わせる。</p>
    <p>人がWebを利用するときの体験から、デザインを見る視点を増やします。</p>
    <p><a href="./lens/perceive/">Human Lensから考える</a></p>
  </li>
  <li>
    <h3>2. 判断する — Practice / By Phase</h3>
    <p>気づいたことを、要件、情報設計、UI、コンテンツ、レビューで何を考えるべきかへつなげます。</p>
    <p><a href="./by-phase/decide/">制作フェーズから探す</a><br><a href="./practices/">Practice一覧を見る</a></p>
  </li>
  <li>
    <h3>3. 根拠を確かめる — Standards</h3>
    <p>必要なときに、PracticeとWCAG 2.2との関係を確認できます。</p>
    <p><a href="./standards/wcag/">WCAGから逆引きする</a></p>
  </li>
</ol>

## 今いるところから始める

最初からすべてを読む必要はありません。

- **初めてこのガイドを見る** — [なぜ、人の違いから考えるのか](./why/)
- **要件や構造を決めている** — [Decide](./by-phase/decide/)
- **デザインを制作している** — [Design](./by-phase/design/)
- **制作物をレビューしている** — [Review](./by-phase/review/)
- **人の体験から考えてみたい** — [Human Lens](./lens/perceive/)

必要なところから、このガイドを使ってください。
