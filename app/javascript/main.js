var EventPhase = 0;    //画面遷移について
var BattleCursor = 1;  //戦闘のカーソル
var MagicCursor = 1;   //呪文選択時のカーソル
var SkillCursor = 1;   //特技選択時のカーソル
var ItemCursor = 1;
let EncounterNum;      //敵が出る乱数

//動作確認用 ここから
//仮置き敵ステータス tableでリストアップしたものを反映したい
let EnemyHp = 50;
let EnemyAtk = 150;
let EnemySpd = 10;
let EnemyDef = 15;
let Lv = gon.player.lv;
      
//仮置きご自身のステータス そのうち内容をuserから取って来させるつもり 他のデータと同じようにgonで移動可能か?
//装備後のステータスは値をもらってから算出するように

let PlayerMaxHp = gon.player.playermaxhp;
let PlayerHp =  gon.player.playerhp;
let PlayerMaxMp = gon.player.playermaxmp;
let PlayerMp = gon.player.playermp;
let PlayerAtk = gon.player.playeratk;
let EquipAtk;
let PlayerSpd = gon.player.playerspd;
let PlayerDef = gon.player.playerdef;
let EquipDef;
let Exp = gon.player.exp;

//ここまで


//オブジェクト名{アイテムのID,アイテムの名前,アイテムの種類,説明文}		ここにアイテムのデータを追加する データベースのseedにおいといて追加する方が綺麗に見える
var Key   = {item_id: 0,item_name:"鍵",item_type : 0,describe:"ドアを開けるための鍵"};
var SKey =  {item_id: 1,item_name:"Sコード",item_type : 0,describe:"配列の真ん中にあるロックを解くカギ"};
var Sword = {item_id: 10,item_name:"つるぎ",item_type : 1,describe:"刃がかけたつるぎ<br>使うと攻撃力が上がる"};
var Spire = {item_id: 11,item_name:"やり",item_type : 1,describe:"先が錆びたやり<br>持うと攻撃力が上がる"};
var Axe   = {item_id: 12,item_name:"オノ",item_type : 1,describe:"柄がボロボロのオノ<br>持うと攻撃力が上がる"};
var Cap   = {item_id: 100,item_name:"変な帽子",item_type : 2,describe:"ここに来た時偶然手に入れた帽子"};
var Shirt = {item_id: 101,item_name:"普段着",item_type : 2,describe:"いつもの普段着<br>一枚で冒険とは我ながら命知らずだ"};
var Shield = {item_id: 102,item_name:"小さな盾",item_type : 2,describe:"バックラーというらしい<br>広く使われた小型の盾"}; 
var GPortion = {item_id: 1000,item_name:"緑のクスリ",item_type : 3,describe:"緑色の液体のクスリ<br>おいしくない..."};
var BPortion = {item_id: 1001,item_name:"青のクスリ",item_type : 3,describe:"青色の液体のクスリ<br>飲みやすく改良されたとか"};
var RPortion = {item_id: 1002,item_name:"赤のクスリ",item_type : 3,describe:"赤色の液体のクスリ<br>生き返るほど辛いらしい"};
var GLeaf = {item_id: 10000,item_name:"ミドリソウ",item_type : 4,describe:"緑の草 ミントではない<br>頭が冴えわたる"};
var BLeaf = {item_id: 10001,item_name:"アオイソウ",item_type : 4,describe:"青い草 少し苦い<br>食べるとふわふわする"};
var WLeaf = {item_id: 10002,item_name:"シラクサ",item_type : 4,describe:"白い草 とても綺麗<br>食べるとあらゆる苦痛を忘れる"};
var Null = {item_id: 100000,item_name:" ",iem_type : 10, describe:"空きスペース"};

//道具鞄配列
var ItemBag = [Null,Null,Null,Null,Null,Null,Null,Null,Null,Null];

//道具テスト用
ItemBag.splice(0,1,Key);
ItemBag.splice(1,1,Sword);
ItemBag.splice(2,1,GPortion);
ItemBag.splice(3,1,GLeaf);

//railsのテーブルから情報持って来れるなら敵のステータスを保存しておいて呼び出す方が良いかも
		
//迷路を作成する画像配列 白紙部分に入れない設定をする
var MazePathSouth = [["/31rRKZNW+eL._AC_SX466_.jpg","/93236_1.jpg","/TWosmj(1).jpg"],
		                 ["/TWosmj(1).jpg","/31rRKZNW+eL._AC_SX466_.jpg","/93236_1.jpg"],
									   ["/31rRKZNW+eL._AC_SX466_.jpg","/93236_1.jpg","/TWosmj(1).jpg"]];

//gonを利用し座標を取得 ステータスはこれで記録ができるはず
var PlayerXPos = gon.player.posx;
var PlayerYPos = gon.player.posy;

//windowについて
window.onload = onLoad;

//敵の画像をここに格納しておいてimgを変えるだけでいいようにしておく
var Enemy = [];

//ステータス表記
function Status(){
	let HP = document.getElementById("status_hp");
	let MP = document.getElementById("status_mp");
	let LV = document.getElementById("status_lv");

	//HP.insertAdjacentHTML('afterend',"HP : " + PlayerHp + " / " + PlayerMaxHp)
	HP.innerHTML = "HP : " + PlayerHp + " / " + PlayerMaxHp;
  MP.innerHTML = "MP : " + PlayerMp + " / " + PlayerMaxMp;
	LV.innerHTML = "LV : " + Lv;
}
		
//Encounter 遭遇したら敵が現れたを表示、EventPhaseを2に
function Encounter(){
	console.log("encounter");
	document.getElementById('message').innerHTML = '<span class="message">てきが あらわれた!<br/>(↑↓キーでメニュー enterで普通の攻撃)</span>';
	EventPhase = 2;
	}

//BattleCommand UIの呼び出しに関わる
function BattleCommand(){
	document.getElementById('message').innerHTML = '<span class="message">さあ どうする?<br/>(↑↓キーを選んで enterで決定)</span>';
	//まずはコマンドの呼び出しから
	let Menu = document.getElementById("menu_exist");
	let NAttack = document.getElementById("menu1");
	let MAttack = document.getElementById("menu2");
	let SAttack = document.getElementById("menu3");
	let Escape = document.getElementById("menu4");

	//コマンドのUIを追加する
	Menu.className = "game_menu";
	NAttack.innerHTML = "たたかう";
	MAttack.innerHTML = "まほう";
	SAttack.innerHTML = "とくぎ";
	Escape.innerHTML = "にげる";
}

//オブジェクトを取得してアイテムのキーを使用できるようにする
function ItemSet(){
	Object.keys(ItemBag).forEach(function(key){
	});
}

//装備アイテムがあるなら埋めていく
function EquipmentCheck(){

}

//道具に対してはこちらから
function ItemManager(ItemCursor){
	ItemSet();
	for(i = 0;i< ItemBag.length;i++){				
		if(ItemBag[ItemCursor-1].item_type == 0){//大事なもの
			switch(ItemBag[ItemCursor-1].item_id){
				case 0:
					document.getElementById('message').innerHTML = '<span class="message">今使う必要は なさそうだ</span>';
				break;

				case 1:
					document.getElementById('message').innerHTML = '<span class="message">今使う必要は なさそうだ</span>';
				break;
			}
   	}else if(ItemBag[ItemCursor-1].item_type == 1){//武器系統
			switch(ItemBag[ItemCursor-1].item_id){
				case 10:
					document.getElementById('message').innerHTML = '<span class="message">手放さない限りは攻撃力が上がるようだ</span>';
				break;

				case 11:
					document.getElementById('message').innerHTML = '<span class="message">手放さない限りは攻撃力が上がるようだ</span>';
				break;

				case 12:
					document.getElementById('message').innerHTML = '<span class="message">手放さない限りは攻撃力が上がるようだ</span>';
				break;

				default:
				break;
			}
		}else if(ItemBag[ItemCursor-1].item_type == 2){//防具系統
			switch(ItemBag[ItemCursor-1].item_id){
				case 100:
					document.getElementById('message').innerHTML = '<span class="message">手放さない限りは防御力が上がるようだ</span>';
				break;
							
				case 101:
				  document.getElementById('message').innerHTML = '<span class="message">手放さない限りは防御力が上がるようだ</span>';
				break;

				case 102:
					document.getElementById('message').innerHTML = '<span class="message">手放さない限りは防御力が上がるようだ</span>';
				break;

				default:
				break;
			}
		}else if(ItemBag[ItemCursor-1].item_type == 3){//回復アイテム
			switch(ItemBag[ItemCursor-1].item_id){
				case 1000:
					document.getElementById('message').innerHTML = '<span class="message">HPが回復した</span>';
					PlayerHp += 50;
					ItemBag.splice(ItemCursor-1,1,Null);
					break;

				case 1001:
					document.getElementById('message').innerHTML = '<span class="message">HPが回復した</span>';
					PlayerHp += 100;
					ItemBag.splice(ItemCursor-1,1,Null);
					break;

				case 1002:
					document.getElementById('message').innerHTML = '<span class="message">HPが回復した</span>';
					PlayerHp += 1000;
					ItemBag.splice(ItemCursor-1,1,Null);
					break;

					default:
						break;
			}
		}else if(ItemBag[ItemCursor-1].item_type == 4){//MP回復用
			switch(ItemBag[ItemCursor-1].item_id){
				case 10000:
					document.getElementById('message').innerHTML = '<span class="message">MPが回復した</span>';
					PlayerMp += 50;
					ItemBag.splice(ItemCursor-1,1,Null);

					break;

				case 10001:
					document.getElementById('message').innerHTML = '<span class="message">MPが回復した</span>';
					PlayerMp += 100;
					ItemBag.splice(ItemCursor-1,1,Null);

					break;

				case 10002:
					document.getElementById('message').innerHTML = '<span class="message">MPが回復した</span>';
					PlayerMp += 1000;
					ItemBag.splice(ItemCursor-1,1,Null);

					break;

					default:
						break;
			}
		}
		
	}
	EventPhase = 0;
	ItemAddRemover();

}

//呼び出されたコマンドに対して、視覚的な選択をさせる矢印の描画
function activeMenu(id){
	if (BattleCursor == id) {
	//前回と同じメニューが選ばれた場合はコマンドを実行
	    PlayerBattleManager(1);
	  } else {
	  	if (BattleCursor != 0) {
		    //現在のメニューのカーソルを消す
			  document.getElementById('menu' + BattleCursor).className = 'menu';
		  }
		  //今回選ばれたメニューにカーソルを表示
		  document.getElementById('menu' + id).className = 'menu menu-active';
			BattleCursor = id;
	}
}

//道具に対して矢印の描画
function ItemMenu(id){
	if (ItemCursor == id) {
	//前回と同じメニューが選ばれた場合はコマンドを実行
	    //PlayerBattleManager(1);
	  } else {
	  	if (ItemCursor != 0) {
		    //クラス名なので変えなくて良い
			  document.getElementById('item_menu' + ItemCursor).className = 'menu';
		  }
		  document.getElementById('item_menu' + id).className = 'menu menu-active';
			ItemCursor = id;
	}
}

//プレイヤーが選択した行動によって行う行動
function PlayerBattleManager(BattleCursor){
	switch(BattleCursor){

	  case 1:
			NormalAttack();

		break;

		case 2:
		  MagicSelection();
			
		break;

		case 3:
			SkillSelection();

		break;

		case 4:
			Escape();

		break;

		default:
		break;
	}
}

//道具が追加、使用されるたびに呼び出されるようにする 何もない場合はからの空きスペースが入っている
function ItemAddRemover(){
	console.log(ItemBag)
	ItemSet();
	let itemFirst = document.getElementById("item_menu1");
	let itemSecond = document.getElementById("item_menu2");
	let itemThird = document.getElementById("item_menu3");
	let itemFourth = document.getElementById("item_menu4");
	let itemFifth = document.getElementById("item_menu5");
	let itemSixth = document.getElementById("item_menu6");
	let itemSeventh = document.getElementById("item_menu7");
	let itemEighth = document.getElementById("item_menu8");
	let itemNinth = document.getElementById("item_menu9");
	let itemTenth = document.getElementById("item_menu10");
	itemFirst.innerHTML = ItemBag[0].item_name;
	itemSecond.innerHTML = ItemBag[1].item_name;
	itemThird.innerHTML = ItemBag[2].item_name;
	itemFourth.innerHTML = ItemBag[3].item_name;
	itemFifth.innerHTML = ItemBag[4].item_name;
	itemSixth.innerHTML = ItemBag[5].item_name;
	itemSeventh.innerHTML = ItemBag[6].item_name;
	itemEighth.innerHTML = ItemBag[7].item_name;
	itemNinth.innerHTML = ItemBag[8].item_name;
	itemTenth.innerHTML = ItemBag[9].item_name;
}

//魔法が選ばれたら呼び出す
function MagicCommand(){

	document.getElementById('message').innerHTML = '<span class="message">魔法を 選ぼう<br/>(↑↓キーを選んで enterで決定)</span>';
	//まずはコマンドの呼び出しから
	let MagicMenu = document.getElementById("magic_exist");
	let MagicFirst = document.getElementById("magic_menu1");
	let MagicSecond = document.getElementById("magic_menu2");
	let MagicThird = document.getElementById("magic_menu3");
	let MagicFourth = document.getElementById("magic_menu4");
	let MagicFifth = document.getElementById("magic_menu5");
	let MagicSixth = document.getElementById("magic_menu6");
	let MagicSeventh = document.getElementById("magic_menu7");
	let MagicEighth = document.getElementById("magic_menu8");
	let MagicNinth = document.getElementById("magic_menu9");

	//コマンドのUIを追加する
	MagicMenu.className = "magic_menu";
	MagicFirst.innerHTML = "ネビエール";
	MagicSecond.innerHTML = "カジカム";
	MagicThird.innerHTML = "ワット";
	MagicFourth.innerHTML = "ラヴァル";
	MagicFifth.innerHTML ="コオルド";
	MagicSixth.innerHTML ="ボルト";
	MagicSeventh.innerHTML ="プロミネート";
	MagicEighth.innerHTML ="アウローラー";
	MagicNinth.innerHTML ="テスラ";
}

function MagicActiveMenu(id){
	if (MagicCursor == id) {
	//前回と同じメニューが選ばれた場合はコマンドを実行
	    MagicSelection(1);
	  } else {
	  	if (MagicCursor != 0) {
		    //現在のメニューのカーソルを消す
			  document.getElementById('magic_menu' + MagicCursor).className = 'menu';
		  }
		  //今回選ばれたメニューにカーソルを表示
		  document.getElementById('magic_menu' + id).className = 'menu menu-active';
			MagicCursor = id;
			console.log(MagicCursor);

	}
}

function SkillActiveMenu(id){
	if (SkillCursor == id) {
	//前回と同じメニューが選ばれた場合はコマンドを実行
	    SkillSelection(1);
	  } else {
	  	if (SkillCursor != 0) {
		    //現在のメニューのカーソルを消す
			  document.getElementById('skill_menu' + SkillCursor).className = 'menu';
		  }
		  //今回選ばれたメニューにカーソルを表示
		  document.getElementById('skill_menu' + id).className = 'menu menu-active';
			SkillCursor = id;
			console.log(SkillCursor);
	}
}

//とくぎが選ばれたら呼び出す
function SkillCommand(){

	document.getElementById('message').innerHTML = '<span class="message">特技を　選ぼう<br/>(↑↓キーを選んで enterで決定)</span>';
	//まずはコマンドの呼び出しから
	let SkillMenu = document.getElementById("skill_exist");
	let SkillFirst= document.getElementById("skill_menu1");
	let SkillSecond = document.getElementById("skill_menu2");
	let SkillThird = document.getElementById("skill_menu3");
	let SkillFourth = document.getElementById("skill_menu4");
	let SkillFifth= document.getElementById("skill_menu5");
	let SkillSixth = document.getElementById("skill_menu6");
	let SkillSeventh = document.getElementById("skill_menu7");
	let SkillEighth = document.getElementById("skill_menu8");
	let SkillNinth= document.getElementById("skill_menu9");

	//コマンドのUIを追加する
	SkillMenu.className = "skill_menu";
	SkillFirst.innerHTML = "打突 面";
	SkillSecond.innerHTML = "抜き付け";
	SkillThird.innerHTML = "振りかぶり";
	SkillFourth.innerHTML = "切り下ろし";
	SkillFifth.innerHTML = "残心";
	SkillSixth.innerHTML = "「喝」";
	SkillSeventh.innerHTML = "連斬";
	SkillEighth.innerHTML = "居合";
	SkillNinth.innerHTML = "必殺「仕事人」";
}

//魔法を選ぶとこちらへ移動する
function MagicSelection(){
	document.getElementById('message').innerHTML = '<span class="message">まほうを みせてやる！</span>';
	switch(MagicCursor){
		case 1:
			MagicFirst();

	  break;

		case 2:
			MagicSecond();

		break;

		case 3:
			MagicThird();

		break;

		case 4:
			MagicFourth();

	  break;

		case 5:
			MagicFifth();

		break;

		case 6:
			MagicSix();

		break;

		case 7:
			MagicSeventh();

		break;

		case 8:
			MagicEighth();

		break;

		case 9:
			MagicNinth();

		default:
		break;
	}
}

//特技を選ぶとこちらへ移動する
function SkillSelection(){
	switch(SkillCursor){
		case 1:
			SkillFirst();

	  break;

		case 2:
			SkillSecond();

		break;

		case 3:
			SkillThird();

		break;

		case 4:
			SkillFourth();

	  break;

		case 5:
			SkillFifth();

		break;

		case 6:
			SkillSixth();

		break;

		case 7:
			SkillSeventh();

		break;

		case 8:
			SkillEighth();

		break;

		case 9:
			SkillNinth();

		default:
		break;
	}
}

//物理攻撃時
function NormalAttack(){

	//攻撃力を元に算出
  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">ふつうに こうげき！</span>';

  EnemyHp -=(PlayerAtk - EnemyDef/3);

  if(EnemyHp <= 0){
		document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
    EventPhase = 6;
  }else if(EnemySpd>PlayerSpd){
		EventPhase = 2;
	}else{
		EventPhase = 3;
	}
	Status();
}

//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー魔法群ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//
//魔法 ネビエールーーーーーーーーーーーーーーーーーーーーーーーーーーーー//
function MagicFirst(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">炎の魔法を みせてやる！</span>';

  if(5 <= PlayerMp && EnemySpd>PlayerSpd){        //MP5以上なら
		EventPhase = 2;
    PlayerMp -= 5;
    EnemyHp -= 15;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(5 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 5;
    EnemyHp -= 15;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//

//魔法 カジカムーーーーーーーーーーーーーーーーーーーーーーーーーーーー//
function MagicSecond(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">氷の魔法を みせてやる！</span>';

  if(7 <= PlayerMp && EnemySpd>PlayerSpd){        //MP7以上なら
		EventPhase = 2;
    PlayerMp -= 7;
    EnemyHp -= 25;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(7 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 7;
    EnemyHp -= 25;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//

//魔法選択時 ワットーーーーーーーーーーーーーーーーーーーーーーーーーーーー//
function MagicThird(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">電撃魔法を みせてやる！</span>';

  if(10 <= PlayerMp && EnemySpd>PlayerSpd){        //MP10以上なら
		EventPhase = 2;
    PlayerMp -= 10;
    EnemyHp -= 40;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(10 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 10;
    EnemyHp -= 40;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//

//魔法 ラヴァル
function MagicFourth(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">炎の魔法を みせてやる！</span>';

  if(15 <= PlayerMp && EnemySpd>PlayerSpd){        //MP5以上なら
		EventPhase = 2;
    PlayerMp -= 15;
    EnemyHp -= 70;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(15 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 15;
    EnemyHp -= 70;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//

//魔法 コオルド
function MagicFifth(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">氷の魔法を みせてやる！</span>';

  if(25 <= PlayerMp && EnemySpd>PlayerSpd){        //MP25以上なら
		EventPhase = 2;
    PlayerMp -= 25;
    EnemyHp -= 120;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(7 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 25;
    EnemyHp -= 120;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//

//魔法 ボルト
function MagicSixth(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">電撃魔法を みせてやる！</span>';

  if(35 <= PlayerMp && EnemySpd>PlayerSpd){        //MP10以上なら
		EventPhase = 3;
    PlayerMp -= 35;
    EnemyHp -= 150;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(35 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 35;
    EnemyHp -= 150;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  	
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//


//魔法 プロミネート
function MagicSeventh(){
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">炎の魔法を みせてやる！</span>';

  if(50 <= PlayerMp && EnemySpd>PlayerSpd){        //MP15以上なら
		EventPhase = 3;
    PlayerMp -= 50;
    EnemyHp -= 250;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(50 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 50;
    EnemyHp -= 250;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//


//魔法 アウローラー
function MagicEighth(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">氷の魔法を みせてやる！</span>';

  if(55 <= PlayerMp && EnemySpd>PlayerSpd){        //MP5以上なら
		EventPhase = 2;
    PlayerMp -= 55;
    EnemyHp -= 265;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(55 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 55;
    EnemyHp -= 265;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//


//魔法 テスラ
function MagicNinth(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">電撃魔法を みせてやる！</span>';

  if(60 <= PlayerMp && EnemySpd>PlayerSpd){        //MP7以上なら
		EventPhase = 2;
    PlayerMp -= 60;
    EnemyHp -= 280;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(60 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 60;
    EnemyHp -= 280;

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}  
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//

//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー魔法群終わりーーーーーーーーーーーーーーーーーーーーーーーーー//

//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー特技群ーーーーーーーーーーーーーーーーーーーーーーーーーーーー//
//特技使用時 打突 面
function SkillFirst(){

  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">とくぎを あじわえ！</span>';

  if(5 <= PlayerMp && EnemySpd>PlayerSpd){        //MP5以上なら
		EventPhase = 2;
    PlayerMp -= 5;
		EnemyHp -=(PlayerAtk*1.8 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(5 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 5;
		EnemyHp -=(PlayerAtk*1.8 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}

function SkillSecond(){

  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">とくぎを あじわえ！</span>';

  if(7 <= PlayerMp && EnemySpd>PlayerSpd){        //MP7以上なら
		EventPhase = 2;
    PlayerMp -= 7;
		EnemyHp -=(PlayerAtk*2.5 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(7 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 7;
		EnemyHp -=(PlayerAtk*2.5 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}

function SkillThird(){

  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">とくぎを あじわえ！</span>';

  if(10 <= PlayerMp && EnemySpd>PlayerSpd){        //MP10以上なら
		EventPhase = 2;
    PlayerMp -= 10;
		EnemyHp -=(PlayerAtk*3 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(10 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 10;
		EnemyHp -=(PlayerAtk*3 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}

function SkillFourth(){

  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">とくぎを あじわえ！</span>';

  if(15 <= PlayerMp && EnemySpd>PlayerSpd){        //MP10以上なら
		EventPhase = 2;
    PlayerMp -= 15;
		EnemyHp -=(PlayerAtk*3.5 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(15 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 15;
		EnemyHp -=(PlayerAtk*3.5 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}

//残心は唯一の回復手段
function SkillFifth(){

  document.getElementById('message').innerHTML = '<span class="message">心を沈める...</span>';
  if(20 <= PlayerMp && EnemySpd>PlayerSpd){        //MP20以上なら
		EventPhase = 2;
    PlayerMp -= 20;
		PlayerHp += PlayerAtk*2;

	  if(PlayerMaxHp <= PlayerHp){      //回復漏れが起こらないように
		  PlayerHp = PlayerMaxHp;
      EventPhase = 6;
		}
	}else if(20 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 20;
		PlayerHp += PlayerAtk*2;

	  if(PlayerMaxHp <= PlayerHp){      //回復漏れが起こらないように
		  PlayerHp = PlayerMaxHp;
      EventPhase = 6;
		}
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}

function SkillSixth(){

  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">とくぎを あじわえ！</span>';

  if(25 <= PlayerMp && EnemySpd>PlayerSpd){        //MP7以上なら
		EventPhase = 2;
    PlayerMp -= 25;
		EnemyHp -=(PlayerAtk*5.5 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(25 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 25;
		EnemyHp -=(PlayerAtk*5.5 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}

function SkillSeventh(){

  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">とくぎを あじわえ！</span>';

  if(30 <= PlayerMp && EnemySpd>PlayerSpd){        //MP10以上なら
		EventPhase = 2;
    PlayerMp -= 30;
		EnemyHp -=(PlayerAtk*7 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(30 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 30;
		EnemyHp -=(PlayerAtk*7 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}

function SkillEighth(){

  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">とくぎを あじわえ！</span>';

  if(40 <= PlayerMp && EnemySpd>PlayerSpd){        //MP10以上なら
		EventPhase = 2;
    PlayerMp -= 40;
		EnemyHp -=(PlayerAtk*3.5 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(40 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 40;
		EnemyHp -=(PlayerAtk*3.5 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}

function SkillNinth(){

  console.log("your attack");
  console.log(EnemyHp);
  document.getElementById('message').innerHTML = '<span class="message">とくぎを あじわえ！</span>';

  if(50 <= PlayerMp && EnemySpd>PlayerSpd){        //MP10以上なら
		EventPhase = 2;
    PlayerMp -= 50;
		EnemyHp -=(PlayerAtk*15 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}
	}else if(50 <= PlayerMp){
		EventPhase = 3;
    PlayerMp -= 50;
		EnemyHp -=(PlayerAtk*15 - EnemyDef/3);

	  if(EnemyHp <= 0){      //これで敵が沈めば
		  document.getElementById('message').innerHTML = '<span class="message">敵を 倒した！</span>';
      EventPhase = 6;
		}	
	}else{                   //なかったら
    console.log("No mp");
		document.getElementById('message').innerHTML = '<span class="message">まりょくがもうない！</span>';

		if(EnemySpd>PlayerSpd){
			EventPhase = 2;
		}else{
			EventPhase = 3;
		}
  }
	Status();
}
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーー特技群終わりーーーーーーーーーーーーーーーーーーーーーーーーー//


//逃げた時の行動
function Escape(){
	
	EscapeNum = Math.floor(Math.random()*2)
	/*if(EnemySpd < PlayerSpd){                //スピードがあれば必ず逃げれる
		console.log("Escape succeed");
		EventPhase = 5;*/
	//}else 
	if(0.5<EscapeNum){ //なければ半分くらい
		console.log("Escape succeed");
		document.getElementById('message').innerHTML = '<span class="message">にげきった！</span>';
		let Menu = document.getElementById("menu_exist");
		let NAttack = document.getElementById("menu1");
		let MAttack = document.getElementById("menu2");
		let SAttack = document.getElementById("menu3");
		let Escape = document.getElementById("menu4");

		Menu.classList.remove("game_menu");
		NAttack.innerHTML = "";
		MAttack.innerHTML = "";
		SAttack.innerHTML = "";
		Escape.innerHTML = "";

		EventPhase = 0;	
	}else{                                   //ダメなら
		console.log("escape failed");
		document.getElementById('message').innerHTML = '<span class="message">しかし まわりこまれてしまった！</span>';

		EventPhase = 3;
	}
}
		
//敵の行動
function EnemyBattleManager(){

	console.log("Enemy attack");
  console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">てきの こうげき！</span>';

	PlayerHp -= (EnemyAtk-PlayerDef/3);

	Status()

	if(EnemySpd>PlayerSpd){
		EventPhase = 4;
	}else{
		EventPhase = 5;
	}
}

//すぐに入力に移動させない
function TurnCalm(){			
  document.getElementById('message').innerHTML = '<span class="message">さあ どうする?</span>';
}

//戦闘が終わってからの処理
function Results(){
	if(BattleCursor != 4){
	  document.getElementById('message').innerHTML = '<span class="message">勝った! 経験値を獲得!</span>';

	  Exp += 10;
    if(Exp <= Lv*5){
			
		}
				
		let Menu = document.getElementById("menu_exist");
		let NAttack = document.getElementById("menu1");
		let MAttack = document.getElementById("menu2");
		let SAttack = document.getElementById("menu3");
		let Escape = document.getElementById("menu4");

		Menu.classList.remove("game_menu");
		NAttack.innerHTML = "";
		MAttack.innerHTML = "";
		SAttack.innerHTML = "";
		Escape.innerHTML = "";

		

		EventPhase = 0;
	}
}


//起動時に1回読み込む
function onLoad(){
	Status();
}

//操作について全てここで監視する 環境変数を定めておけば変えられる
window.addEventListener("keyup",function(e){
	switch(EventPhase){
			
	 case 0://マップ移動時はココ参照

		console.log("key Up:" + e.key);
		document.getElementById('message').innerHTML = '<span class="message">配列の続きを 進もう</span>';

		switch(e.keyCode){//キーコード→←↑↓について
			case 38:
				e.preventDefault();
				if(PlayerXPos <= 0){
					console.log("you can't");
				}else{
					PlayerXPos --;
					console.log("player up X locate is" + PlayerXPos);
					document.getElementById("game_image").src = MazePathSouth[PlayerXPos][PlayerYPos];
				}
					EncounterNum = Math.floor( Math.random()*2);
					
					if(EncounterNum*100 < 60){
						EventPhase  = 1;
				 	}
			break;
					
			case 40:
				e.preventDefault();
				if(PlayerXPos >= 2){
					console.log("you can't");
				}else{
					PlayerXPos ++;
					console.log("player down X locate is" + PlayerXPos);
					document.getElementById("game_image").src = MazePathSouth[PlayerXPos][PlayerYPos];
				}
					EncounterNum = Math.floor( Math.random()*2);
					
					if(EncounterNum*100 < 60){
            EventPhase  = 1;
				 	}
			break;

			case 39:
				e.preventDefault();
				if(PlayerYPos >= 2){
					console.log("you can't");
				}else{
					PlayerYPos ++;
				  console.log("player right Y locate is" + PlayerYPos);
				  document.getElementById("game_image").src = MazePathSouth[PlayerXPos][PlayerYPos];
				}
					EncounterNum = Math.floor( Math.random()*2);
					
					if(EncounterNum*100 < 60){
						EventPhase  = 1;
				 	}
			break;

			case 37:
				e.preventDefault();
				if(PlayerYPos <= 0){
					console.log("you can't");
				}else{
					PlayerYPos --;
				  console.log("player left  Y locate is" + PlayerYPos);
					document.getElementById("game_image").src = MazePathSouth[PlayerXPos][PlayerYPos];
				}
					EncounterNum = Math.floor( Math.random()*2);
					
					if(EncounterNum*100 < 60){
						EventPhase  = 1;
				 	}
			break;

			case 73:
				EventPhase = 10;
				document.getElementById('message').innerHTML = '<span class="message">道具を使用する</span>';

			break;

			case 83:
				EventPhase = 9;
			break;

			default:
			break;

	 }
	 break;

	 case 1://敵に出会った場合の処理 キーはなんでもいい
    Encounter();
	 break;

	 case 2://コマンドバトルのコマンド受け付け
		BattleCommand()
	  switch(e.keyCode){//戦闘コマンドが入力されたら

      case 13://何をするか決定
			  if(BattleCursor == 2){
					document.getElementById('message').innerHTML = '<span class="message">魔法を選ぼう</span>';
					EventPhase = 7;
				}
				else if(BattleCursor == 3){
					document.getElementById('message').innerHTML = '<span class="message">特技を選ぼう</span>';
					EventPhase = 8;
				}else{
	   			document.getElementById('message').innerHTML = '<span class="message">ボタンを押そう！</span>';
					document.getElementById('menu' + BattleCursor).className = 'menu menu-nonactive';

					if(EnemySpd>PlayerSpd){
						EventPhase = 3;
					}else{
						EventPhase = 4;
					}
				}
      break; 

			case 38://上矢印の処理
				if (BattleCursor <= 1) {
					activeMenu(4);
				} else {
					activeMenu(BattleCursor - 1);
				}	
			break;

			case 40://下矢印の処理
				if (BattleCursor >= 4) {
					activeMenu(1);
				} else {
					activeMenu(BattleCursor + 1);
				}
			break;

			default:
				activeMenu(1);
			break;
		}
	 break;

   case 3://バトルの処理 敵ターン
    EnemyBattleManager();
   break;

	 case 4://自分のターン
    PlayerBattleManager(BattleCursor);
   break;

	 case 5:
		TurnCalm();
	  EventPhase = 2;
   break;

	 case 6://戦闘終了
		Results();
   break;

	 case 7://魔法を選んだ時
  	 MagicCommand();
		 switch(e.keyCode){//戦闘コマンドが入力されたら

			case 13://何をするか決定
			
				document.getElementById('message').innerHTML = '<span class="message">ボタンを押そう！</span>';
				document.getElementById('magic_menu' + MagicCursor).className = 'menu menu-nonactive';
				document.getElementById('menu' + BattleCursor).className = 'menu menu-nonactive';

				if(EnemySpd>PlayerSpd){
					EventPhase = 3;
				}else{
					EventPhase = 4;
				}

				let MagicMenu = document.getElementById("magic_exist");
				let MagicFirst = document.getElementById("magic_menu1");
				let MagicSecond = document.getElementById("magic_menu2");
				let MagicThird = document.getElementById("magic_menu3");
				let MagicFourth = document.getElementById("magic_menu4");
				let MagicFifth = document.getElementById("magic_menu5");
				let MagicSixth = document.getElementById("magic_menu6");
				let MagicSeventh = document.getElementById("magic_menu7");
				let MagicEighth = document.getElementById("magic_menu8");
				let MagicNinth = document.getElementById("magic_menu9");

				MagicMenu.classList.remove("magic_menu");
				MagicFirst.innerHTML = "";
				MagicSecond.innerHTML = "";
				MagicThird.innerHTML = "";
				MagicFourth.innerHTML = "";
				MagicFifth.innerHTML ="";
				MagicSixth.innerHTML ="";
				MagicSeventh.innerHTML ="";
				MagicEighth.innerHTML ="";
				MagicNinth.innerHTML ="";
			
			break; 

			case 38://上矢印の処理
				if (MagicCursor <= 1) {
					MagicActiveMenu(9);
				} else {
					MagicActiveMenu(MagicCursor - 1);
				}	
			break;

			case 40://下矢印の処理
				if (MagicCursor >= 9) {
					MagicActiveMenu(1);
				} else {
					MagicActiveMenu(MagicCursor + 1);
				}
			break;

		default:
			MagicActiveMenu(1);
		break;
	}
 break;

	 case 8://特技を選んだ時
	  SkillCommand();
	 	switch(e.keyCode){//戦闘コマンドが入力されたら

			case 13://何をするか決定
		
				document.getElementById('message').innerHTML = '<span class="message">ボタンを押そう！</span>';
				document.getElementById('skill_menu' + SkillCursor).className = 'menu menu-nonactive';
				document.getElementById('menu' + BattleCursor).className = 'menu menu-nonactive';

				if(EnemySpd>PlayerSpd){
					EventPhase = 3;
				}else{
					EventPhase = 4;
				}

				let SkillMenu = document.getElementById("skill_exist");
				let SkillFirst= document.getElementById("skill_menu1");
				let SkillSecond = document.getElementById("skill_menu2");
				let SkillThird = document.getElementById("skill_menu3");
				let SkillFourth = document.getElementById("skill_menu4");
				let SkillFifth= document.getElementById("skill_menu5");
				let SkillSixth = document.getElementById("skill_menu6");
				let SkillSeventh = document.getElementById("skill_menu7");
				let SkillEighth = document.getElementById("skill_menu8");
				let SkillNinth= document.getElementById("skill_menu9");

				SkillMenu.classList.remove("skill_menu");
				SkillFirst.innerHTML = "";
				SkillSecond.innerHTML = "";
				SkillThird.innerHTML = "";
				SkillFourth.innerHTML = "";
				SkillFifth.innerHTML = "";
				SkillSixth.innerHTML = "";
				SkillSeventh.innerHTML = "";
			  SkillEighth.innerHTML = "";
				SkillNinth.innerHTML = "";

				break; 

			case 38://上矢印の処理
				if (SkillCursor <= 1) {
					SkillActiveMenu(9);
				} else {
					SkillActiveMenu(SkillCursor - 1);
				}	
			break;

			case 40://下矢印の処理
				if (SkillCursor >= 9) {
					SkillActiveMenu(1);
				} else {
					SkillActiveMenu(SkillCursor + 1);
				}

			break;

	default:
		SkillActiveMenu(1);
	break;
}
	 break;

	 case 9://ステータス確認
		document.getElementById('message').innerHTML = '<span class="message">今のステータスです' + '<br>攻撃力 ' + PlayerAtk +'<br>防御力 ' + PlayerDef + '<br>早さ ' + PlayerSpd +'<br>経験値'+ Exp +'<br>Enterで戻る' + '</span>';
    if (e.keyCode == 13){
			document.getElementById('message').innerHTML = '<span class="message">何かキーを入力してください</span>'
			EventPhase = 0;
		}
	
	break;

	 case 10://道具確認
	 ItemAddRemover();
		switch(e.keyCode){//iボタンが押されたら

      case 13://何をするか決定
			document.getElementById('item_menu' + ItemCursor).className = 'menu menu-nonactive';
			EventPhase = 11;

			 
      break; 

			case 38://上矢印の処理
				if (ItemCursor <= 1) {
					ItemMenu(ItemBag.length);
					document.getElementById('message').innerHTML = ItemBag[ItemCursor-1].describe;

				} else {
					ItemMenu(ItemCursor - 1);
					document.getElementById('message').innerHTML = ItemBag[ItemCursor-1].describe;
				}	
			break;

			case 40://下矢印の処理
				if (ItemCursor > ItemBag.length - 1) {
					ItemMenu(1);
					document.getElementById('message').innerHTML = ItemBag[ItemCursor-1].describe;

				} else {
					ItemMenu(ItemCursor + 1);
					document.getElementById('message').innerHTML = ItemBag[ItemCursor-1].describe;

				}
			break;

			default:
				ItemMenu(ItemBag.length[0]);
			break;
		}
	 break;

	 case 11:
		 ItemManager(ItemCursor);
		 break;

	 default:
		console.log(e.keyCode);
		
	 break;
        
	 }

});

//save時の処理はここで データが増えたらフォームを増やす
window.addEventListener('load', function(){

	//EventListenerで変更された値を渡す textfieldがreadonlyでもこちらで更新可能
	const btn = document.getElementById("mbtn");
	const posx = document.getElementById("position_x");
	const posy = document.getElementById("position_y");
	const HP = document.getElementById("hp");
	const MHP = document.getElementById("max_hp");
	const MP = document.getElementById("mp");
	const MMP = document.getElementById("max_mp");
	const ATK = document.getElementById("atk");
	const DEF = document.getElementById("def");
	const SPD = document.getElementById("spd");
	const LV = document.getElementById("lv");
	const EXP = document.getElementById("exp");

	btn.addEventListener('click', function() {
		posx.value = PlayerXPos;
		posy.value = PlayerYPos;
		HP.value = PlayerHp;
		MHP.value = PlayerMaxHp;
		MP.value = PlayerMp;
		MMP.value = PlayerMaxMp;
		ATK.value = PlayerAtk;
		DEF.value = PlayerDef;
		SPD.value = PlayerSpd;
		LV.value = Lv;
		EXP.value = Exp;
 
	});

});
	