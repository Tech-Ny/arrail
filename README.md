# README

### アプリ名:Arrail

### 概要
簡単なRPGを遊ぶことができるゲームを作成しました。

### 制作背景
現在コロナ禍でなかなか遊びにいく機会が少なくなってしまいました。<br>
そこで家の中にいても楽しめるものに焦点を当て、
ルールがシンプルで遊びやすいものを作成するということでRPGを選択しました。<br>
全体的に昔のテイストにすることで懐かしさも感じてもらえれば良いと思い白黒を基調としたビューにしています。<br>
また、ほとんどの工程がhtmlとjavascriptの組み合わせで出来ているので、
初学者の勉強用の教材としても優しい内容で遊びながら学んでもらうことができるかと思います。

### 仕様など
railsのデータベースを活用すれば、値を保存することができるので、
遊ぶ暇がなくても値を保存しておけ流ようにしました。<br>
これにより、多数のuserの情報を保持しておくことも可能になり、
ランキングや元々のデータを参照した対戦などもできるようになります(こちらは追加実装する予定です)。

### 実装したもの
制作期間:四週目までで出来たこと

##### 配列でのマップ実装
・矢印キーで手探りで進んでいくような感じにしたかったため<br>
・配列を使用した他の理由は<br>
|実装しやすいこと<br>
|実際に中に立って移動しているような体験を与えやすいこと<br>
|初学者にもソースコードの記述をとってもらいやすいようにするため<br>

##### rails deviseでのユーザー識別
変数を用いた画面遷移<br>
例えばマップ移動時→戦闘など

##### 基本画面の作成
railsのアクションに沿った基本の画面を作成<br>
javascript上で行うRPG部分の作成

##### セーブ機能
javascript→rails→javascriptのような<br>
jqueryとgonを用いた双方向への互換

### 実装予定内容
マップの追加<br>
各種ステータスのパラメータを追加<br>
HP MP レベルの表示<br>
敵データの作成<br>
現在地以外の画像を追加<br>
特技、魔法の追加<br>
道具の取得<br>
シナリオの追加<br>

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

## 以下、実際の映像となります
#### サインイン時
<img width="1269" alt="スクリーンショット 2021-03-19 12 00 22" src="https://user-images.githubusercontent.com/78017327/111725608-b5274680-88aa-11eb-9642-1fa2ca7666d5.png">

#### サインアップ時
<img width="1314" alt="スクリーンショット 2021-03-19 11 53 10" src="https://user-images.githubusercontent.com/78017327/111725078-bad05c80-88a9-11eb-80dc-4b20bba9ec87.png">

#### index画面
<img width="1329" alt="スクリーンショット 2021-03-19 11 54 01" src="https://user-images.githubusercontent.com/78017327/111725127-d50a3a80-88a9-11eb-9dbf-854ef7baaa51.png">

#### show画面
<img width="1332" alt="スクリーンショット 2021-03-19 11 55 16" src="https://user-images.githubusercontent.com/78017327/111725199-fec36180-88a9-11eb-9a49-e9976161a3b0.png">


#### show画面戦闘中
<img width="1319" alt="スクリーンショット 2021-03-19 11 56 17" src="https://user-images.githubusercontent.com/78017327/111725279-24e90180-88aa-11eb-9e75-7cfad6da123b.png">

#### save画面 (現在座標のみをセーブ)
<img width="1123" alt="スクリーンショット 2021-03-19 11 58 58" src="https://user-images.githubusercontent.com/78017327/111725546-9a54d200-88aa-11eb-8ba4-0f1151f85a1a.png">

 
