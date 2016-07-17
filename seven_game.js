
var player_length ='';
var player_obj =[];//回傳的物件
var all_card =[];
var cardControl =[];
var str_p='';//先開始的人
var countPlayerNumber;
var card;

var flowerIndex='';//花色參照值
    flowerIndex["C"]=6;
    flowerIndex["D"]=4;
    flowerIndex["H"]=2;
    flowerIndex["S"]=0;


Array.prototype.shuffle = function() {//洗牌
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}





function name(p){//去除空格
	var   s   =  p.name;        
	var   new_s   =   s.replace(/\s/g, "")
	p.name = new_s ;    
	console.log('更新之後的名稱'+new_s);
}


  function deal_card(array){//可以出的牌有哪些
  	clientPi =[];
  	var result;
  	console.log('進入deal_card');
  	console.log('array'+ array);
	console.log('array.length'+ array.length);    
              for(var i=0; i<array.length; i++){
              		if(array[i]!= null ){
              			     result = cutCard(array[i]);
                             console.log('切過的值'+ result['cardNumber']);
                             //console.log('第一個'+ cardControl[flowerIndex[cut_card['cardFlower']]+0]);
							 //console.log('這是deal_card哪些可以出？'+ cardControl[flowerIndex[result['cardFlower']]+0]);
							 //console.log('這是deal_card哪些可以出？'+ cardControl[flowerIndex[result['cardFlower']]+1]);

							 if(result['cardNumber']== cardControl[flowerIndex[result['cardFlower']]+0] || result['cardNumber']==cardControl[flowerIndex[result['cardFlower']]+1]){
								 clientPi.push(array[i]);
                                  console.log("可以出"+array[i]);                                  
                             } 
              		}
                                  
               }
                        console.log('clientPi陣列＝'+ clientPi);
                        //allOfPlayer[i].socket.emit('ClientInfro', clientPi); 
                        return clientPi;                
    }


    function cutCard(id){//切割牌
    	console.log('cutCard'+ id);
		var flower = id.substring(0,1);//取出英文
		var number = id.substring(1,3);//取出數字
		return {cardNumber: number, cardFlower: flower};
	//console.log(flower, number);	
	}






var newGame = function(players, tv, players_name, players_pic){

	card = [           
            "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12", "H13", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13"           
            ]; 



	card.shuffle();//洗牌
	all_card = '';
	all_card = JSON.parse(JSON.stringify(card));//每局都有一副牌
	str_p ='';
	player_obj=[];
	player_length = players.length;
	countPlayerNumber = 0;
	cardControl=[7,7,7,7,7,7,7,7];//控制哪張牌可以出
	flowerIndex=new Object;//新建一個物件
	flowerIndex["C"]=6;
    flowerIndex["D"]=4;
    flowerIndex["H"]=2;
    flowerIndex["S"]=0;


    //flowerIndex=["C","D","H","S"];


	for(var i=0;i<players.length;i++){
		var p = new Player(players[i],i, players_name[i], players_pic[i]);
		name(p);
		playerGiveCard(p);//給這個人牌
		p.card.sort();//排序

		player_obj.push(p);				
	}

	giveIndex(player_obj);//發牌
	console.log('開始人的全部卡片：'+ str_p.card);
	var dealcard = deal_card(str_p.card);//哪些排可以出
	return { players:player_obj, start_p:str_p, card_c_deal:dealcard }; //所有人, 開始的人

	/*this.giveNewIndex = function (player){//把要牌的socket傳進來,加一張牌給他
		 var num = random(0, card.length - 1);
         var card_n = card[num];//哪一張牌
         card.splice(num, 1);//移除這張牌
         player.socket.emit('oneNewCard', card_n);
         player.socket.emit('oneNewCardToTable', card_n);//傳給table
         //socket
	} */    

  }


function giveIndex(player_obj){//這個人的參照值
	player_obj.forEach(function(element, index, array){
		element.index = index;
		var whoIsFirst = checkTheFirstPeople(element.card);
	        if(whoIsFirst==true){
		    str_p = element;
		    countPlayerNumber = str_p.index;
	        }
	})
}





function change_player(players, p, card_id, dealcard_array){
	var change_p;
	var dealcard;
	var boolean_check;
	var end= false;//判斷結束了沒
	var win;//贏的人
	//去確認可不可以出，可以出就換人，不能就繼續

	if(dealcard_array.length ==0){
		console.log('這個人只能蓋牌');
		boolean_check = true;
		countPlayerNumber = (countPlayerNumber+1) %4;
		var data = cutCard(card_id);//要把蓋牌數字記錄下來
		console.log('蓋牌的數字：'+ data['cardNumber']);//蓋牌的數字
		for(var j=0; j< player_obj.length; j++){
			if(player_obj[j].guid == p.guid){
				console.log('之前累積德蓋牌陣列'+ player_obj[j].back);//蓋牌陣列
				player_obj[j].back.push(card_id);
				console.log('現在這個人的蓋牌陣列'+ player_obj[j].back);
				
				console.log('之前的累積蓋牌數字'+ player_obj[j].score);
				n = Number(data['cardNumber']);//
				player_obj[j].score = n + player_obj[j].score ; 
				player_obj[j].backcount = player_obj[j].backcount +1;
				console.log('現在這個人蓋牌的累積：'+ player_obj[j].score);
				p.score = player_obj[j].score;
				console.log('現在這個人蓋牌幾張：'+ player_obj[j].backcount);
				p.backcount = p.backcount + 1;//蓋牌加一張
				console.log('現在這個人蓋牌幾張：'+ p.backcount);
			}
		}
		//console.log('之前的累積蓋牌數字'+ p.score);
		//p.score = (p.score + data['cardNumber']);//加到分數裡面
		//console.log('現在這個人蓋牌的累積：'+ p.score);
		console.log('boolean_check:'+ boolean_check);
		console.log('現在這個人的guid:'+ p.guid);
	}

	if(dealcard_array.length !=0){
		boolean_check = check_card(p, card_id);//確認這張牌可不可以出
		console.log('boolean_check:'+ boolean_check);
	}


	if(boolean_check == true){
		//誰是下一個人
		for(var i=0; i<player_obj.length; i++){
			if(player_obj[i].index == countPlayerNumber){
				change_p = player_obj[i];
				console.log('change_p現在應該換玩家'+ change_p);
				console.log('change_p的guid:'+ change_p.guid);
				dealcard = deal_card(change_p.card);//哪些排可以出
			}
				//把出過的牌刪掉
			else if(player_obj[i].guid == p.guid){
				for(var j=0; j< player_obj[i].card.length; j++){
					if(player_obj[i].card[j] == card_id){ 
						delete  player_obj[i].card[j];
					  }
				}
				console.log('切過的新陣列：'+ player_obj[i].card);
				}


			}

			var c_end = check_end(change_p, player_obj);//下一個人
			//下一個人沒有dealcard而且所有卡都是null
			console.log('遊戲是否結束：'+ c_end['end']);
			console.log('贏家是？'+ c_end['win_p'])
			if(c_end['end'] == true){ end = true;  win = c_end['win_p'];}


			return{ players:player_obj, play_p:change_p, dealcard:dealcard, p_score:p.score, end: end, win_p:win }

			}

		
		//all_socket[ p.guid ].emit('hideCard', card_id);
	

	else if(boolean_check == false){
		end = false;
		return{ players:player_obj, play_p:p, dealcard:dealcard, p_score:p.score, end:end, win_p:win }
	}

}




function check_end(change_p, player_obj){//判斷結束
	console.log('下一個玩家的guid：'+ change_p.guid);
	var c=0;//判斷是否結束
	var array_win=[];
	for(var i=0; i< change_p.card.length; i++){

		if(change_p.card[i]!= null){ 
			c=1;
			return{ end: false, win_p: null}
		}
	}
	if(c ==0){//表示遊戲結束
		var w=100;//贏家
		var w_p;

		for(var j=0; j< player_obj.length; j++){
			if(player_obj[j].score < w){
				//array_win.push(player_obj[j]);//只要分數是零就是贏家
				w_p = player_obj[j];
				w = player_obj[j].score;
			}

			
		}//找出誰是贏家
		console.log('贏家蓋牌的數字是多少？'+ w);
		array_win.push(w_p);

		return{  end: true, win_p: array_win }
	}
}




function check_card(p, card_id){//換玩家
	console.log('進入check card');
	var cut_card = cutCard(card_id);
		console.log('切過的牌'+ cut_card);
			var succ=false;
			console.log('第一個'+ cardControl[flowerIndex[cut_card['cardFlower']]+0]);
			console.log('第二個'+ cardControl[flowerIndex[cut_card['cardFlower']]+1]);
			if(cut_card['cardNumber'] == cardControl[flowerIndex[cut_card['cardFlower']]+0]){
				succ= true;
				cardControl[flowerIndex[cut_card['cardFlower']]+0]++;
			}
			if(cut_card['cardNumber'] == cardControl[flowerIndex[cut_card['cardFlower']]+1]){
				succ= true;
				cardControl[flowerIndex[cut_card['cardFlower']]+1]--;
			}

			if(succ){
				console.log(cardControl);
				countPlayerNumber = (countPlayerNumber+1) %4;
				console.log('countPlayerNumber:'+ countPlayerNumber);
				return true;
				//回傳資料
				//all_socket[ p.guid ].emit('hideCard', card_id);
			}

			else{  return false; };

		
}



  function Player(u_guid,i, name, pic){
  	 var self = this;
  	 this.guid = u_guid;
  	 this.index ='';
  	 this.name = name;
  	 this.pic = pic;
  	 this.count =0;
  	 this.card = [];//這個人的牌
  	 this.score =0;//蓋得多的人輸
  	 this.backcount=0;//蓋牌數量
  	 this.back=[];//蓋了哪一張牌
  }
   


function random(min,max) {
return Math.floor(Math.random()*(max-min+1)+min);
}



function checkTheFirstPeople(card){//第一個出牌的人
	for(var i=0;i< card.length; i++){
			if(card[i] == "S7"){
				return true;
			}		
	}	
}




function playerGiveCard(p) {//發牌
	
    	for (var i = 0; i < 13; i++ ){
        	var num = random(0, card.length - 1);
			var card_n = card[num];
        
			if (p.count < 13) {
            	p.card[i] = card_n;
				p.count++;
				card.splice(num, 1); //讓牌不要重複!刪除random出的值
            
			}
		}       
}




module.exports = Game= {
    'newGame':newGame,
    'change_player':change_player,
    
}
