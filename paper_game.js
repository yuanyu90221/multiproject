var player_length ='';
var player_obj =[];//回傳的物件
var count =0;// 計算有誰已經按了，是二的時候就表示結束了
var board='';//牌面資訊
var clear_board=new Array(3);
var inning =0;//玩了幾局

//設定主程式
function set_game(players, tv, players_name){
	count = 0;
	board = new Array(3);
	player_obj=[];
	inning =0;
	player_length = players.length;
	for(var i=0;i<players.length;i++){
		var p = new Player(players[i],i, players_name[i]);
		name(p);
		
		player_obj.push(p);				
	}
	return {players:player_obj}; //物件陣列 
}





function choose_p(id, b_val, p){//誰按的  按了幾號
	for(i=0; i<player_obj.length; i++){
		if(player_obj[i].guid == p ){
			count++;
			player_obj[i].choice = id;
			player_obj[i].val = b_val;
			pic_save(b_val, p);
			return { players:player_obj, p:player_obj[i], count:count}
		 }
	}

}


function name(p){//去除空格
	var   s   =  p.name;        
	var   new_s   =   s.replace(/\s/g, "")
	p.name = new_s ;    
	console.log('更新之後的名稱'+new_s);
}



function pic_save(b_val, p){
	for(i=0; i<player_obj.length; i++){
		if(player_obj[i].guid == p ){
			if(b_val =='剪刀'){
				player_obj[i].pic.push('../static/scissors.jpg');
			}
			if(b_val =='石頭'){
				player_obj[i].pic.push('../static/stone.jpg');
			}
			if(b_val =='布'){
				player_obj[i].pic.push('../static/papers.jpg');
			}
		}
		
	}
	
}


function winner(player_obj){//判斷輸贏
	inning ++;
	player_obj[0].score = 0;
	player_obj[1].score = 0;

	for(var i=0; i<player_obj.length; i++){
		if(player_obj[0].choice == player_obj[1].choice){ 
		player_obj[0].score = 5;
		player_obj[1].score = 5;
		console.log('這是現在這個 player_obj[0]人的分數'+ player_obj[0].score);
		console.log('這是現在這個 player_obj[1]人的分數'+ player_obj[1].score);
		player_obj[0].calculate += 5;//石頭＋布
		player_obj[1].calculate += 5;//石頭＋布
		console.log('這是現在這個 player_obj[0].calculate人的分數'+ player_obj[1].calculate);
		console.log('這是現在這個 player_obj[0].calculate人的分數'+ player_obj[0].calculate);
		return {win_p:player_obj[1], players:player_obj, inning:inning}
		}
		
		if(player_obj[0].choice == 1 && player_obj[1].choice == 2){
			player_obj[1].score = 10;
		console.log('這是現在這個 player_obj[0]人的分數'+ player_obj[0].score);
		console.log('這是現在這個 player_obj[1]人的分數'+ player_obj[1].score);
			player_obj[1].calculate += 10;//石頭＋布
			console.log('這是現在這個 player_obj[1].calculate人的分數'+ player_obj[1].calculate);
		console.log('這是現在這個 player_obj[0].calculate人的分數'+ player_obj[0].calculate);
			return {win_p:player_obj[1], players:player_obj, inning:inning}
		}
		
		else if(player_obj[0].choice == 2 && player_obj[1].choice == 0){//布＋剪刀
			player_obj[1].score = 10;
			console.log('這是現在這個 player_obj[0]人的分數'+ player_obj[0].score);
		console.log('這是現在這個 player_obj[1]人的分數'+ player_obj[1].score);
			player_obj[1].calculate += 10;
			console.log('這是現在這個 player_obj[1].calculate人的分數'+ player_obj[1].calculate);
		console.log('這是現在這個 player_obj[0].calculate人的分數'+ player_obj[0].calculate);
			return {win_p:player_obj[1], players:player_obj, inning:inning}
		}
		
		else if(player_obj[0].choice == 0 && player_obj[1].choice == 1){//剪刀＋石頭
			player_obj[1].score = 10;
			console.log('這是現在這個 player_obj[0]人的分數'+ player_obj[0].score);
		console.log('這是現在這個 player_obj[1]人的分數'+ player_obj[1].score);
			player_obj[1].calculate += 10;
			console.log('這是現在這個 player_obj[1].calculate人的分數'+ player_obj[1].calculate);
		console.log('這是現在這個 player_obj[0].calculate人的分數'+ player_obj[0].calculate);
			return {win_p:player_obj[1], players:player_obj, inning:inning}
		}
		
		else if(player_obj[0].choice == 2 && player_obj[1].choice == 1){//布＋石頭
			player_obj[0].score = 10;
			player_obj[1].score = 0;
			console.log('這是現在這個 player_obj[0]人的分數'+ player_obj[0].score);
		console.log('這是現在這個 player_obj[1]人的分數'+ player_obj[1].score);
			
			player_obj[0].calculate += 10;
			console.log('這是現在這個 player_obj[1].calculate人的分數'+ player_obj[1].calculate);
		console.log('這是現在這個 player_obj[0].calculate人的分數'+ player_obj[0].calculate);
			return {win_p:player_obj[0], players:player_obj, inning:inning}
		}
		
		else if(player_obj[0].choice == 0 && player_obj[1].choice == 2){//剪刀+布
			player_obj[0].score = 10;
			console.log('這是現在這個 player_obj[0]人的分數'+ player_obj[0].score);
		console.log('這是現在這個 player_obj[1]人的分數'+ player_obj[1].score);
			player_obj[0].calculate += 10;
			console.log('這是現在這個 player_obj[1].calculate人的分數'+ player_obj[1].calculate);
		console.log('這是現在這個 player_obj[0].calculate人的分數'+ player_obj[0].calculate);
			return {win_p:player_obj[0], players:player_obj, inning:inning}
		}
		
		else if(player_obj[0].choice == 1 && player_obj[1].choice == 0){//石頭＋剪刀
			player_obj[0].score = 10;
			console.log('這是現在這個 player_obj[0]人的分數'+ player_obj[0].score);
		console.log('這是現在這個 player_obj[1]人的分數'+ player_obj[1].score);
			player_obj[0].calculate += 10;
			console.log('這是現在這個 player_obj[1].calculate人的分數'+ player_obj[1].calculate);
		console.log('這是現在這個 player_obj[0].calculate人的分數'+ player_obj[0].calculate);
			return {win_p:player_obj[0], players:player_obj, inning:inning}
		}
		
		else{ return null }
		
	}
}


//玩家要有的資訊
function Player(u_guid,i, name) {
	var self = this;
    this.guid = u_guid; //這個人得guid
    this.val = '';//這個人的圖案 
    this.name = name;
    this.score = 0; 
    this.calculate =0;//累積五局的成績
    this.choice ='';  
    this.pic =[];  //圖片陣列  
}




module.exports = Game= { 
	'winner':winner,
	'choose_p':choose_p,
	'Player': Player,
    'set_game':set_game,
} 
