var player_length ='';
var player_obj =[];//回傳的物件
var board='';//牌面資訊
var clear_board=new Array(9);
var count =0;//算已經按了幾次
//設定主程式
function set_game(players, tv, players_name){
	count = 0;
	board = new Array(9);
	player_obj=[];
	player_length = players.length;
	for(var i=0;i<players.length;i++){
		var p = new Player(players[i],i, players_name[i]);
		pic_random(p,i);//設定圖案
		var str_p = start_p(p);//現在可以動作的玩家
		player_obj.push(p);				
	}
	return {players:player_obj, str_p:str_p}; //物件陣列 誰先開始 
}




//選圖案    
function pic_random(p,i){
	var picture =['O','X'];
	p.pic = picture[i];	
}





function start_p(p){//誰先開始
	if(p.pic === 'X'){
		return p;
	}
}



function choose_p(id, p){//誰按的  按了幾號
var o=0, x=0;
	for(var i=0;i<board.length;i++){
		if(board[i]=='X'){++x};
		if(board[i]=='O'){++o};	
	}
	count = (o+x+1);//現在的count值
	console.log('有'+x+'個叉叉'+','+'有'+o+'個圈圈');
	console.log('現在已經按了幾次？'+count+'次');	
	if(x==0 && p.pic=='X'){ board[id] = p.pic; }	
	if(x>o && p.pic=='O'){ board[id] = p.pic;}
	if(x==o && p.pic =='X')	{ board[id] = p.pic; }
		
	return { board:board, players:player_obj };
	// {players:player_obj, str_p:str_p};
}


function winner(board, p){//有人贏了嗎？
console.log('現在已經按了幾次？'+count+'次');
		if(board[0]== board[1] && board[0]== board[2] && board[0]==p.pic){ 
		p.score=10; 
		console.log('這是贏的人之成績：'+p.score);
		return {win_p:p} }
		
		if(board[3]== board[4] && board[3]== board[5] && board[3]==p.pic){ 
		p.score=10; 
		console.log('這是贏的人之成績：'+p.score);
		return {win_p:p } }
		
		if(board[6]== board[7] && board[6]== board[8] && board[6]==p.pic){ 
		p.score=10; 
		console.log('這是贏的人之成績：'+p.score);
		return {win_p:p} }
		
		if(board[0]== board[3] && board[0]== board[6] && board[0]==p.pic){ 
		p.score=10; 
		console.log('這是贏的人之成績：'+p.score);
		return {win_p:p} }
		
		if(board[1]== board[4] && board[1]== board[7] && board[1]==p.pic){ 
		p.score=10; 
		console.log('這是贏的人之成績：'+p.score);
		return {win_p:p} }
		
		if(board[2]== board[5] && board[2]== board[8] && board[2]==p.pic){ 
		p.score=10; 
		console.log('這是贏的人之成績：'+p.score);
		return {win_p:p} }
		
		if(board[0]== board[4] && board[0]== board[8] && board[0]==p.pic){ 
		p.score=10; 
		console.log('這是贏的人之成績：'+p.score);
		return { win_p:p} }
		
		if(board[2]== board[4] && board[2]== board[6] && board[2]==p.pic){ 
		p.score=10; 
		console.log('這是贏的人之成績：'+p.score);
		return {win_p:p} }
		
		if(count == 9){
			p.score=5;
			console.log('這是平手的成績：'+p.score);
			return { win_p:p}
			
		}	
}


//玩家要有的資訊
function Player(u_guid,i, name) {
	var self = this;
    this.guid = u_guid; //這個人得guid
    this.pic = '';//這個人的圖案 
    this.name = name;
    this.score = 0;       
}




module.exports = Game= { 
	'winner':winner,
	'choose_p':choose_p,
	'Player': Player,
    'set_game':set_game,
} 




