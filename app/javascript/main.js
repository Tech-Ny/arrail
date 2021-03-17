var EventPhase = 0;    //画面遷移について
var BattleCursor = 1;  //戦闘のカーソル
let EncounterNum;      //敵が出る乱数

//動作確認用 ここから
//仮置き敵ステータス tableでリストアップしたものをまとめたい
let EnemyHp = 50;
let EnemyAtk = 5;
let EnemySpd = 10;
let EnemyDef = 15;
let Lv = 1;
      
//仮置きご自身のステータス そのうち内容をuserから取って来させるつもり
let PlayerHp =  100;
let PlayerAtk = 10;
let PlayerMp = 10;
let PlayerSpd = 15;
let PlayerDef = 15;
let Exp = 0;
//ここまで

//railsのテーブルから情報持って来れるなら敵のステータスを保存しておいて呼び出す方が良いかも
		
//迷路を作成する画像配列 白紙部分に入れない設定をする
var MazePathSouth = [["/31rRKZNW+eL._AC_SX466_.jpg","/93236_1.jpg","/TWosmj(1).jpg"],
		                 ["/TWosmj(1).jpg","/31rRKZNW+eL._AC_SX466_.jpg","/93236_1.jpg"],
									   ["/31rRKZNW+eL._AC_SX466_.jpg","/93236_1/.jpg","/TWosmj(1).jpg"]];
		
var PlayerXPos = gon.player.posx;
var PlayerYPos = gon.player.posy;

//敵の画像をここに格納しておいてimgを変えるだけでいいようにしておく
var Enemy = [];
		
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

function Items(){
	
}
/*
function MagicCommand(){

}
*/

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
			console.log(BattleCursor);
	}
}
    
    //プレイヤーが選択した行動によって行う行動
function PlayerBattleManager(BattleCursor){
	switch(BattleCursor){

	  case 1:
			NormalAttack();

		break;

		case 2:
			MagicAttack();

		break;

		case 3:
			Skill();

		break;

		case 4:
			Escape();

		break;

		default:
		break;
	}
}

function magicselection(){
	switch(MagicCursor){
		case 1:

	  break;

		case 2:

		break;

		case 3:

		break;

		case 4:

	  break;

		case 5:

		break;

		case 6:

		break;

		case 7:

		break;

		case 8:

		break;

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
}
      
//魔法選択時 固定ダメージ
function MagicAttack(){
	
  console.log("your attack");
	console.log(EnemyHp);
	document.getElementById('message').innerHTML = '<span class="message">まほうを みせてやる！</span>';

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
}  

//特技使用時 物理の1.8倍攻撃
function Skill(){

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
	}else if(3 <= PlayerMp){
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
}

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
		EventPhase = 6;	
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
	if(BattleCursor  != 4){
    console.log("Exp get!");
	  document.getElementById('message').innerHTML = '<span class="message">勝った! 経験値を獲得!</span>';

	  Exp += 10;
    if(Exp <= Lv*5){
      console.log("Lv UP!")
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
	
//操作について全てここで監視する 環境変数を定めておけば変えられる
window.addEventListener("keyup",function(e){

	switch(EventPhase){
			
	 case 0://マップ移動時はココ参照
		console.log("key Up:" + e.key);
		document.getElementById('message').innerHTML = '<span class="message">配列の続きを 進もう</span>';
					
		switch(e.keyCode){//キーコード→←↑↓について
			case 38:
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
   			document.getElementById('message').innerHTML = '<span class="message">ボタンを押そう！</span>';
				document.getElementById('menu' + BattleCursor).className = 'menu menu-nonactive';


				if(EnemySpd>PlayerSpd){
					EventPhase = 3;
				}else{
					EventPhase = 4;
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
				ctiveMenu(1);
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

	 case 7://以下シナリオ
	 break;

	 default:
		console.log(e.keyCode);
	 break;
        
	 }

});

//save時の処理
window.addEventListener('load', function(){

	const btn = document.getElementById("mbtn");
	const posx = document.getElementById("position_x");
	const posy = document.getElementById("position_y");

	btn.addEventListener('click', function() {
		posx.value = PlayerXPos;
		posy.value = PlayerYPos;

	});

});
	