# README

### アプリ名:Arrail

### 概要
簡単なRPGを遊ぶことができるゲームを作成しました。

### 制作背景
現在コロナ禍でなかなか遊びにいく機会が少なくなってしまいました。
そこで家の中にいても楽しめるものに焦点を当て、
ルールがシンプルで遊びやすいものを作成するということでRPGを選択しました。
全体的に昔のテイストにすることで懐かしさも感じてもらえれば良いと思い白黒を基調としたビューにしています。
また、ほとんどの工程がhtmlとjavascriptの組み合わせで出来ているので、
初学者の勉強用の教材としても優しい内容で遊びながら学んでもらうことができるかと思います。

### 仕様など
railsのデータベースを活用すれば、値を保存することができるので、
遊ぶ暇がなくても値を保存しておけ流ようにしました。
これにより、多数のuserの情報を保持しておくことも可能になり、
ランキングや元々のデータを参照した対戦などもできるようになります(こちらは追加実装する予定です)。

### 実装したもの
制作期間:四週目までで出来たこと

##### 配列でのマップ実装
・矢印キーで手探りで進んでいくような感じにしたかったため
・配列を使用した他の理由は
 実装しやすいこと
 実際に中に立って移動しているような体験を与えやすいこと
 初学者にもソースコードの記述をとってもらいやすいようにするため があがる

##### rails deviseでのユーザー識別
変数を用いた画面遷移
例えばマップ移動時→戦闘など

##### 基本画面の作成
railsのアクションに沿った基本の画面を作成
javascript上で行うRPG部分の作成

##### セーブ機能
javascript→rails→javascriptのような
jqueryとgonを用いた双方向への互換

### 実装予定内容
マップの追加
各種ステータスのパラメータを追加
HP MP レベルの表示
敵データの作成
現在地以外の画像を追加
特技、魔法の追加
道具の取得
シナリオの追加

DB(データは追加予定)
## user
| Column             | Type   | Options                 |
| -------------------| -------| ------------------------|
| :email             | string | null: false, default: ""|
| :encrypted_password| string | null: false, default: ""|
| :nickname          | string | null: false, default: ""|

### has_one player

## player
| Column            | Type       | Options     |
| ------------------| -----------| ------------|
| :posx             | integer    | null: false |
| :posy             | integer    | null: false |
| :user             | references | null: false |

### belongs_to user
