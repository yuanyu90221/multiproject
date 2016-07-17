var memory_array = [];//全部的字母

var a = ['A','A','B','B','C','C','D','D','E','E','F','F'];//全部的字母
var b =['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L'];//全部的字母
var memory_values = [];
var memory_tile_ids = [];
var memory_array_m = [];//記錄已經被翻開的牌
var tiles_flipped = 0;
var click_count = 0;

var player_length ='';
var player_obj =[];//回傳的物件

Array.prototype.memory_tile_shuffle = function(){//shuffle
    var i = this.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i+1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}


function newBoard(players, players_name, flip_select_number){//產生新的板子
	player_length = players.length;
	tiles_flipped =0;
	click_count = 0;
	memory_values = [];
	memory_tile_ids = [];
	memory_array_m =[];
	if(flip_select_number == 1){
		memory_array = a;//簡單的
	}
	if(flip_select_number == 2){
		memory_array = b;
	}
	
	player_obj =[];	
	for(var i=0;i<players.length;i++){
		var p = new Player(players[i],i, players_name[i]);
		color(p);
		player_obj.push(p);						
	}	
    memory_array.memory_tile_shuffle();    
	return  { tiles:memory_array, str_p:player_obj[0], players: player_obj};
}






function Player(u_guid,i, name) {
	var self = this;
    this.guid = u_guid; //這個人得guid
    this.index = i;//第幾個出牌
    this.fliped = 0;//記錄贏了幾組牌
    this.color =''; //顏色 
    this.name = name;//名字account          
}

function color(p){
	var color =['#63F2CF','#F9977F','#BA55D3','#FFFF00','#7CFC00'];
	p.color = color[p.index];//這個人的顏色
}


function check_end(){

	if(tiles_flipped == memory_array.length){//如果全部翻完了
	var highest_score =0;
		for(var i=0; i< player_obj.length; i++){
			if(player_obj[i].fliped> highest_score){highest_score = player_obj[i].fliped;}
		}
		return { all_score:player_obj, winner_score:highest_score, winner:player_obj[i]}//所有人的資料
		
	}
}


function choose_p(){
	if(player_length ==2){
		if(click_count%4==0 || click_count%4==1){return player_obj[0]}
		else if(click_count%4==2 || click_count%4==3){return player_obj[1]}
	}
	if(player_length == 3){
		if(click_count%6==0 || click_count%6==1){return player_obj[0]}
		else if(click_count%6==2 || click_count%6==3){return player_obj[1]}
		else if(click_count%6==4 || click_count%6==5){return player_obj[2]}
	}
	if(player_length==4 ){
				if(click_count%8==0 || click_count%8==1){return player_obj[0]}
		else if(click_count%8==2 || click_count%8==3){return player_obj[1]}
		else if(click_count%8==4 || click_count%8==5){return player_obj[2]}
		else if(click_count%8==6 || click_count%8==7){return player_obj[3]}
	}
}




function next_p(){

	var p = choose_p();
	console.log(p.guid);
	return {new_p:p}
}



function memoryFlipTile(t_id, id,t_text, player){

	var r_player = choose_p();//看這個人可不可以動
	console.log('這個玩家的guid:'+r_player.guid+'傳進來的player:'+player);
	if(player == r_player.guid){
		click_count++;
	if(t_text == null && memory_values.length < 2){
		console.log('我的t_text：'+t_text+'現在的memory_values.length：'+memory_values.length);
		if(memory_values.length == 0){
					var fliped = null;
					memory_values.push(memory_array[id]);
					memory_tile_ids.push(t_id);
					return {t_id:t_id, img:memory_array[id], player:r_player, memory_tile_ids:memory_tile_ids, player_obj:player_obj, fliped:fliped}
				
			
						
		}     
		
		
		else if(memory_values.length == 1 ){//有翻對
			var memory_tile_ids_2= '';
			memory_values.push(memory_array[id]);
			memory_tile_ids.push(t_id);
			if(memory_values[0] == memory_values[1] && memory_tile_ids[0] != memory_tile_ids[1]){
				tiles_flipped += 2;
				var fliped = memory_values[1];//記住現在這隔符號
				r_player.fliped ++;
				//memory_array_m.push(memory_values[1]);
				// Clear both arrays
				memory_tile_ids_2 = memory_tile_ids;
				memory_values = [];

				memory_tile_ids = [];
            	click_count = (click_count-2);//這個人繼續玩
				// Check to see if the whole board is cleared												
				return { t_id:t_id, img:memory_array[id], player:r_player, memory_tile_ids:memory_tile_ids, player_obj:player_obj, fliped:fliped, memory_tile_fliped: memory_tile_ids_2}
				
            	
				
			}
			
			if(memory_tile_ids[0] == memory_tile_ids[1]){//按到同一張牌
				click_count--;
				var fliped = null;
				memory_tile_ids.splice (1, 1);
				memory_values.splice (1, 1);
				return {t_id:t_id, img:memory_array[id], player:r_player, memory_tile_ids:memory_tile_ids, player_obj:player_obj, fliped:fliped}
			}
			
			
			 else {
			 	//next_p(click_count);//看現在該誰玩了
			 var fliped = null;

			 	return{ t_id:t_id, img:memory_array[id], player:r_player, memory_tile_ids:memory_tile_ids, player_obj:player_obj, fliped:fliped }					
				
			}
		}
	}
}

}

function empty(){
	memory_values = [];
    memory_tile_ids = [];
}




module.exports = Game= { 
	'newBoard':newBoard,
	'memoryFlipTile':memoryFlipTile,
	'empty':empty,
	'check_end':check_end,
	'next_p':next_p,
} 



