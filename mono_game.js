var player_obj =[];//所有玩家
var player_length;
var click_count;

var place_owner;
var place_house;


//設定遊戲主程式
function set_game(players, tv, players_name, players_pic){  //players, player_i, players_name
	//board = new Array(3);
	place_owner = [0,0,0,null,0,0,0,0,0,null,0,0,0,0,0,0,0,0,0,0];
	place_house =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	click_count =1
	player_obj=[];
	player_length = players.length;
	for(var i=0;i<players.length;i++){
		var p = new Player(players[i],i, players_name[i], players_pic[i]);
		p.position =0;
		color(p);
		name(p);
		toy(p);
		house(p);
		player_obj.push(p);				
	}
	return {players:player_obj, str_p:player_obj[0]}; //物件陣列 
}


function color(p){
	var color =['#63F2CF','#F9977F','#BA55D3','#FFFF00','#7CFC00'];
	p.color = color[p.index];//這個人的顏色
}

function toy(p){
	var toy =['../flags/one.png', '../flags/two.png', '../flags/three.png', '../flags/four.png'];
	p.toy = toy[p.index];
	
}

function house(p){
	var house=['../flags/house01.png','../flags/house02.png','../flags/house03.png', '../flags/house04.png'];
	p.h = house[p.index];
}




function name(p){//去除空格
	var   s   =  p.name;        
	var   new_s   =   s.replace(/\s/g, "")
	p.name = new_s ;    
	console.log('更新之後的名稱'+new_s);
}




function choose_p(){
	if(player_length ==2){
		if(click_count%2!=0 ){return player_obj[0]}
		else if(click_count%2==0){return player_obj[1]}
	}
	if(player_length == 3){
		if(click_count%3==1 ){return player_obj[0]}
		else if(click_count%3==2){return player_obj[1]}
		else if(click_count%3==0){return player_obj[2]}
	}
	if(player_length==4 ){
				if(click_count%4==0 ){return player_obj[0]}
		else if(click_count%4==1){return player_obj[1]}
		else if(click_count%4==2 ){return player_obj[2]}
		else if(click_count%4==3 ){return player_obj[3]}
	}
}





//玩家要有的資訊
function Player(u_guid,i, name, pic) {
	var self = this;
    this.guid = u_guid; //這個人得guid
    this.money = 10000;//這個人的錢 
    this.name = name;
    this.position = ''; //現在位置
    this.last_p =0; //上一個位置
    this.color ='';//這人的顏色 
    this.house ='';//房子
    this.place =[];//地
    this.index = i;
    this.pic = pic;//照片
    this.toy ='';//動物
    this.h ='';//房子
}



function change_money(p, price){
	for(var i=0; i< player_obj.length; i++){
		if(p.guid == player_obj[i].guid){
			if(player_obj[i].money - (price)>0){
			console.log(p.name+'這個人原來的錢'+p.money);
				player_obj[i].money = player_obj[i].money - price;
				//那個地的主人是這個人
				console.log(p.name+'這個人後來的錢'+p.money);
				place_owner[player_obj[i].position] = player_obj[i];
				return{ players:player_obj, p:p, change:true  }	
			}
			else{ return{ players:player_obj, p:p, change:false  } }
			
		}
	}
}




Array.prototype.card_shuffle = function(){//shuffle
    var i = this.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i+1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}





function change_position(p, r_number){
	click_count ++;
	
	
	for(var i=0; i< player_obj.length; i++){
		if(p.guid == player_obj[i].guid){
		//p.last_p = p.position;
		player_obj[i].last_p = player_obj[i].position;//紀錄上一個位置
		if(r_number+ player_obj[i].position > 19){
			
			console.log('這格人之前的錢'+ player_obj[i].money);
			player_obj[i].money = (player_obj[i].money + 500);
			console.log('這格人教過原點之後的錢'+ player_obj[i].money);
			player_obj[i].position = (r_number+ player_obj[i].position)%19;
			var get = step_script(player_obj[i], player_obj[i].position);
			 //players:player_obj, p:p, script:s, price:b; chance:c 
			 console.log(get.players);
			return{ players:get.players, p:get.p, script:get.script, price:get.price, chance:get.chance, position:get.position , pay:get.pay, more_h:get.more_h, position_last:player_obj[i].last_p  }	
		}

		else{
			player_obj[i].position = r_number+ player_obj[i].position;
			var get = step_script(player_obj[i], player_obj[i].position);
			console.log(get.players);
			return{ players:get.players,  p:get.p, script:get.script, price:get.price, chance:get.chance, position:get.position, lucky:get.lucky, free:get.free, pay:get.pay, more_h:get.more_h, position_last:player_obj[i].last_p }	
		}
		}
		
		}	
}



//要顯示給client每一格的話
var script = ['剛好到起始點，獲得$2000','中國大陸','日本','命運','泰國','慕尼黑機場','臺北','馬爾地夫','美國','命運','馬來西雅','俄羅斯','埃及','匈牙利機場','荷蘭','澳洲','德國','柬埔寨','法國','蘇黎世機場'];

var buy =[1000,600,600,0,1000,2000,1000,2000,1400,0,2000,3600,3000,2000,2800,2600,2400,1000,2200,2000]; 
//金額




chance_card = ['幸運獲得$1000','繳罰單$500','去醫院看病花費$700','撿錢包到警察局獲得$8000','超商偷東西罰$3000'];


special = [2000, 200, 0, 1];//
//處理機會命運
change_card_price = [1000,-500,-700,8000,-3000];




function chance(){
var number =[0,1,2,3,4];
	 number.card_shuffle();
	 return {c:chance_card[number[1]], c_p:change_card_price[number[1]]}; 
}



function build_house(p){
	for(var i=0; i< player_obj.length; i++){
		if(p.guid == player_obj[i].guid){
			var position = p.position;
			place_house[position] = place_house[position]+1;
			console.log('這裡有幾棟房子'+ place_house[position]);
			//一棟房子600元
			p.money = (p.money -600);
			player_obj[i].money = p.money;
			return{ players:player_obj, p:p, house:place_house[position] }
		}
	}
}




function step_script(p, position){

	var s = script[position];
	var b = buy[position];
	console.log(s);
	console.log(b);
	if(b == 0){
			
		var chan = chance();		
		console.log(chan.c);
		console.log(chan.c_p);
		p.money = p.money +(chan.c_p);
		return{ players:player_obj, p:p, script:s, price:b, chance:chan, position:p.position, lucky:false , free:false, pay:false, more_h:false}		
	}
	
	if(b ==10){
		//免費蓋一棟房子
		console.log('免費蓋一棟房子');	
		return{  players:player_obj, p:p, script:s, price:b, chance:chan, position:p.position, lucky:false, free:true, pay:false , more_h:false}	
	}
	
	if(b >0 && b<10){
		var n = (b-1);
		var sp = special[b-1];
		if(n < 3){
			p.money = p.money + special[b-1];
			
			return{  players:player_obj, p:p, script:s, price:b, chance:chan, position:p.position, lucky:true, free:false, pay:false, more_h:false}
		}
	}
	
	else {
		var po = place_owner[position];
		console.log('這個地的擁有者：'+ po.name);
		
		if(po == 0){
			//return{p:p, position:position, script:s, buy:b}//可以買
			console.log('可以買房子');
			return{  players:player_obj, p:p, script:s, price:b, chance:chan, position:p.position, lucky:false , free:false, pay:false, more_h:false}
		}
		
		if(po.guid == p.guid) {
			//可以再蓋一棟房子
			console.log('可以再蓋一棟房子');
			return{ players:player_obj, p:p, script:s, price:b, chance:chan, position:p.position, lucky:false , free:false, pay:false, more_h:true}
			
			} 
			
			
		else{
			//給別人錢
			var h = place_house[position];
			console.log('這個地有'+ h +'棟房子');
			var owner = place_owner[position];
			console.log('這個地的主人'+ owner.name);
			var pay_m = pay_money(b,h, owner);//付錢
			
			console.log('要付'+ pay +'錢給'+ owner.name);
			p.money = p.money-(pay);
			owner.money = owner.money+(pay);
			
			//return{ p:p, position:position, script:s, pay:pay }
			console.log('要給別人錢');
			return{  players:player_obj, p:p, script:s, price:b, chance:chan, position:p.position, lucky:false, free:false, pay:pay_m, more_h:false}
		}
	}		
}


function pay_money(b,h, owner){//b=多少錢 h=有幾棟房子 owner=誰的房子
	var house = h*600//一棟房子加600園
	pay = (b + house);//一個房子的錢＊幾棟房子
	
	return {pay:pay, owner:owner, house:h}	
}

function all_place(p){
var places =[];
var house =[];
	for(var i=0; i< place_owner.length; i++){
		if(place_owner[i]!=0 && place_owner[i]!=null){
			if(place_owner[i].guid == p.guid){
				console.log(script[i]);
				places.push(script[i]);
				house.push(place_house[i]);
			}
		}
	}
	return{ p:p, places:places, house:house, players:player_obj }
}


function latest_money(p){
	return {p:p, players:player_obj};
}

//this.money


function check_end(p){//判斷遊戲結束了沒
console.log('近來這邊了！！！！');
	var game=0;
	for(var i=0; i<player_obj.length; i++){
		if(p.guid == player_obj[i].guid){
			if(player_obj[i].money <= 0){
			var win =0;
				for(var j=0; j<player_obj.length; j++){
					if(player_obj[j].money > win){
						win = player_obj[j];
					}
				}
				console.log('遊戲結束');
				console.log('這個人剩下多少錢？'+player_obj[i].money);
				game = false;
				console.log('這是game的值'+ game);
				return {players:player_obj, p:player_obj[i], win_p:win, game:false};
			}
			
			if(player_obj[i].money>0){
				console.log('這個人剩下多少錢？'+player_obj[i].money);
				console.log('遊戲繼續');
				game = true; 
				console.log('這是game的值'+ game);
				return {players:player_obj, p:player_obj[i], game:true};
			}
		}
	}
}




module.exports = Game= { 
	'set_game':set_game,
	'change_position':change_position,
	'change_money':change_money,
	'choose_p':choose_p,
	'all_place':all_place,
	'build_house':build_house,
	'latest_money':latest_money,
	'check_end':check_end,
	}

