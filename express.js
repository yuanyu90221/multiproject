var express = require("express")

, app = express(), server = require('http').createServer(app), io = require('socket.io').listen(server);
server.listen(8000); //表示localhost的網址的port

var Game = require('./ox_game'),
    Game_f = require('./flip_game'),
    Game_p = require('./paper_game'),
    Game_m = require('./mono_game'),
    Game_s = require('./seven_game'),
    config = require("./mysql_config"),//連到mysql
    db = config.db,
    uuid = require('node-uuid'),// 用來產生類似 GUID 的字串  
    utilObj = require('./util'),
    all_inning = [],//所有電視的guid
    all_game_guid = [],//所有遊戲的guid
    all_socket = {}, //MAP OBJECT 所有的socket
    player_g = '',
    player_i = '';
var dbconfig = require('./dbConfig');
var jade = require('jade');
var sequelize = require('sequelize');
var host =  utilObj.util('config.json','host');
var routerCtrl = require('./modules/routerCtrl');
//var socketCtrl = require('./modules/socketCtrl');
//var dbAccessModule = require('./modules/dbAccessModule');

// 取得url 判斷進入哪個遊戲
routerCtrl.routerCtrl(app,player_g);


//console.log(dbconfig.host);
//取得url 判斷進入哪個遊戲
// app.get('/?', function(req, res) {
//   console.log(req.query.game);
//   if (req.query.game == undefined) {
//     res.sendfile(__dirname + '/index.html');
//   } else {
//     player_g = req.query.game.split("?")[0];
//     player_i = req.query.inning;
//     console.log('這是這個遊戲的guid:' + player_g);
//     console.log('這是這個遊戲的局guid:' + player_i);
//     if (player_g == 'aea3d281-a111-4272-b4a4-77863c090fef') { //圈叉
//       res.sendfile(__dirname + '/index_oxx.htm');
//     }
//     if (player_g == '313d4029-7bc5-454d-ac2b-a3d5dee5e60b') { //配對遊戲
//       res.sendfile(__dirname + '/index_flip.htm');
//     }
//     if (player_g == '67af5ab1-a004-41a2-b9e4-74733f0c765f') { //剪刀石頭佈
//       res.sendfile(__dirname + '/index_paper.htm');
//     }
//     if (player_g == '27b38a5bde-89fd-44ba-9cf4-c3cf76866f95') { //大富翁
//       res.sendfile(__dirname + '/index_mono.htm');
//     }
//     if (player_g == '0c4aecb4-da19-4ece-b40e-e48c3f3d7bc2') { //撲克排七
//       res.sendfile(__dirname + '/index_seven.htm');
//     }
//   }
// });

//使用的資料夾
app.use('/css', express.static(__dirname + '/css'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/flags', express.static(__dirname + '/all_flag'));
app.get('/test',function(req,res){
  res.render = function(template, options){
    var str = require('fs').readFileSync(template, 'utf8');
    var fn = jade.compile(str, {filename:template, pretty: true});
    var page = fn(options);
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(page);
  };
  res.render('index.jade',{'host':dbconfig.host});
});

// //+++++撈資料
// var select_Useer = 'SELECT * FROM User';
// sqlQuery(select_Useer, function(err, result){
// console.log('select_Useer')
// console.log(result)
// });

//+++++++測試
// db.query('SELECT g_name,game_guid FROM ' + 'Game', function(err, results, fields) {
//   if (err) throw err;
//   var all_gamename = results;
//   console.log(results);
// });

  var flip_select_number = '';
  var walk_number = '';

 

    function sqlQuery(str, callback){//joanne 20160718
      db.query(str, function(err, result) {
        if (err) {
          console.log('SQLerr');
          console.log(err);
          callback(err, result);
        }
        //成功的資訊
        console.log('sqlQuery_data');
        console.log(result);
        callback(err, result);
      });
    }

function new_game_check(tv_guid, game_guid) { //進入另外一個遊戲之後是否開始的判斷

    //找出這個遊戲的所有guid,拿出map的資料,傳給選擇器
    var now_players = [];
    var players_name = [];
    var players_pic = [];
    var sql_g_name = "SELECT user_gref, user_account, user_pic from Inning_user where inning_gref ='" + tv_guid + "' AND online =1 AND game_guid='" + game_guid + "'";
    db.query(sql_g_name, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      for (var i = 0; i < result.length; i++) {
        now_players.push(result[i].user_gref);
        players_name.push(result[i].user_account);
        players_pic.push(result[i].user_pic);
        console.log("玩家名稱guid與name：" + result[i].user_gref, result[i].user_account);
      }


      console.log('所有玩家的guid:' + now_players);
      console.log('所有玩家的name:' + players_name);
      selecter(now_players, player_i, players_name, players_pic);
    });
} 

function over() { //剩下的所有玩家
    console.log('遊戲over的function');


    var g_name = '';
    var sql_g_name = "SELECT * from Game where game_guid ='" + player_g + "'";

    db.query(sql_g_name, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }

      g_data = result;
      g_name = g_data[0].g_name;
      console.log("名字是：" + g_name);
    });

    var sql_people = "SELECT * from inning_user where inning_gref='" + player_i + "'AND game_guid='" + player_g + "'AND online='" + 1 + "'";

    console.log(sql_people);
    db.query(sql_people, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('現在的result是：' + result);
      console.log('現在的result[0]是：' + result[0]);
      //console.log('現在的result[0].user_gref是：'+ result[0].user_gref);

      if (result[0] == undefined) {

        db.query('SELECT g_name,game_guid FROM Game', function(err, results, fields) {
          if (err) throw err;
          var all_game = results;
          console.log(all_game);

          all_socket[player_i].emit('qrcode', all_game, player_i);
        });

      } else {

        all_socket[result[0].user_gref].emit('not_enough_p'); //遊戲結束
        all_socket[player_i].emit('not_enough_tv', player_i, player_g, g_name); //給電視
      }
    });
}

function game_start(key, p_name, pic) { //遊戲開始呼叫的function
    //此人加入inning_user資料表    
    var key_iu = uuid.v4();
    console.log(key_iu);
    var sql_iu = "INSERT INTO Inning_user(iu_guid,inning_gref,game_guid, user_gref,user_account,user_pic, online) VALUES('" + key_iu + "','" + player_i + "','" + player_g + "','" + key + "','" + p_name + "','" + pic + "', '" + 1 + "')";
    console.log(sql_iu);
    db.query(sql_iu, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
    });
    //找出這個遊戲的所有guid,拿出map的資料,傳給選擇器
    var now_players = [];
    var players_name = [];
    var players_pic = [];
    var sql_g_name = "SELECT user_gref, user_account, user_pic from Inning_user where inning_gref ='" + player_i + "' AND online ='" + 1 + "' AND game_guid='" + player_g + "'";
    console.log(sql_g_name + "這是最後的資料");
    db.query(sql_g_name, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      for (var i = 0; i < result.length; i++) {
        now_players.push(result[i].user_gref);
        players_name.push(result[i].user_account);
        players_pic.push(result[i].user_pic);
        console.log("玩家名稱guid與name：" + result[i].user_gref, result[i].user_account);
      }

      console.log('所有玩家的guid:' + now_players);
      console.log('所有玩家的name:' + players_name);
      selecter(now_players, player_i, players_name, players_pic, flip_select_number);
    });
}

function points(players) {
    for (var j = 0; j < players.length; j++) {
      var all_score = []; //所有人的成績（之前的）
      var find_score = "SELECT score from Inning_user where user_gref ='" + players[j] + "' AND game_guid ='" + player_g + "'";
      console.log(find_score);
      db.query(find_score, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        var name = result[0].score; //這個人的成績
        console.log('這個人目前成績' + result[0].score);
        all_socket[player_i].emit('score_before_tv', result[0].score);

      }); //+++++++++++++++++++++++++++++++     
    }
}

function selecter(players, player_i, players_name, players_pic, flip_select_number) {

    console.log('兩個參數' + players + '一個電視' + player_i);
    console.log('進入selecter函數');

    if (player_g == '313d4029-7bc5-454d-ac2b-a3d5dee5e60b') {
      var data = new Game_f.newGame(players, players_name, flip_select_number);
      //把它設定為沒有值
      console.log('資料陣列' + data.tiles);

      points(players);


      for (var i = 0; i < data.players.length; i++) {
        console.log('這個玩家的guid：' + data.players[i].guid);
        console.log('先開始的人' + data.str_p.guid + '他的名字' + data.str_p.name);
        all_socket[data.players[i].guid].emit('show_tiles', data.tiles, data.players[i].guid, data.str_p, data.str_p.name, data.players, flip_select_number);
      }
      all_socket[player_i].emit('show_tiles_tv', data.tiles, players[i], data.str_p, data.str_p.name, data.players, flip_select_number);
      flip_select_number = '';
    }



    if (player_g == 'aea3d281-a111-4272-b4a4-77863c090fef') {
      var action = new Game.newGame(players, player_i, players_name); //action 是所有的player與裡面的資料
      console.log('接收資料' + action);

      points(players);

      for (var i = 0; i < action.players.length; i++) {
        console.log('這個玩家的guid：' + action.players[i].guid);
        console.log('這個玩家的pic：' + action.players[i].pic);
        console.log('這個遊戲誰先開始：' + action.str_p.guid);


        all_socket[action.players[i].guid].emit('ox_game_start', action.players[i], action.str_p.guid);
      }
      all_socket[player_i].emit('ox_game_start_tv', action.str_p, action.players);

    }


    if (player_g == '67af5ab1-a004-41a2-b9e4-74733f0c765f') {
      var action = new Game_p.newGame(players, player_i, players_name);
      console.log('接收資料' + action);
      points(players);

      for (var i = 0; i < action.players.length; i++) {
        all_socket[action.players[i].guid].emit('paper_game_start', action.players[i]);
      }
      all_socket[player_i].emit('paper_game_start_tv', action.players);


    }


    if (player_g == '27b38a5bde-89fd-44ba-9cf4-c3cf76866f95') {
      var action = new Game_m.newGame(players, player_i, players_name, players_pic);
      console.log('第一個要骰子的人是' + action.str_p.name + '這個人現在的位置是' + action.str_p.position);

      for (var i = 0; i < action.players.length; i++) {
        all_socket[action.players[i].guid].emit('mono_game_start', action.players[i], action.str_p);
      }

      all_socket[player_i].emit('mono_game_start_tv', action.players, action.str_p);

    }


    if (player_g == '0c4aecb4-da19-4ece-b40e-e48c3f3d7bc2') { //排七
      var action = new Game_s.newGame(players, player_i, players_name, players_pic);
      console.log('這是排七一開始回傳的資料：' + action.players +
        '開始得人：' + action.start_p);

      for (var j = 0; j < action.start_p.card.length; j++) {
        console.log(action.start_p.card[j]);
      }

      console.log(action.card_c_deal);


      for (var i = 0; i < action.players.length; i++) { //傳給所有人

        all_socket[action.players[i].guid].emit('seven_game_start', action.players, action.players[i], action.start_p, action.card_c_deal);
      }
      all_socket[action.start_p.guid].emit('card_infro', action.card_c_deal); //是一個array
      all_socket[player_i].emit('seven_game_start_tv', action.players, action.start_p);
    }
}

function toy_animation(p, position, walk_number) {
    console.log("Request handler 'start' was called.");

    function sleep(milliSeconds) {
      var startTime = new Date().getTime();
      while (new Date().getTime() < startTime + milliSeconds);
    }

    sleep(500);
    all_socket[player_i].emit('toy_move_tv', p, position, walk_number); //幾點，傳過去

    return "send animation!!!!!!!";
}

function all_name(players) { //所有玩家的名稱
    var names = []; //目前所有玩家的名稱
    for (var i = 0; i < players.length; i++) {
      var all_p_name = "SELECT account from User where user_guid ='" + players[i] + "'";
      console.log(all_p_name);
      db.query(all_p_name, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        names.push(result[0].account);
        console.log('這是其中一個人的名稱：' + result[0].account);
        console.log('這是目前的names陣列：' + names);
        return

      });
    }
}

function add_score(score, guid) {

    var sql_score = "UPDATE Inning_user SET score= score + '" + score + "' WHERE user_gref ='" + guid + "' AND game_guid = '" + player_g + "'"; //存入累計成績inning user

    console.log(sql_score);
    db.query(sql_score, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
    });


    var sql_s = "UPDATE User SET score_sum= score_sum + '" + score + "' WHERE user_guid ='" + guid + "'"; //存入累計成績inning user

    console.log(sql_s);
    db.query(sql_s, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
    });
}


//連線開始 
io.sockets.on('connection', function(socket) {
  console.log('connection');

  //電視連線
  socket.on('tv', function() {
    var tv_s = socket;
    console.log("新的ㄧ台電視連線");

    var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //現在的時間
    console.log('現在的時間' + date);

    var key = uuid.v4();//產生key
    all_inning.push(key);//所有電視的key

    sqlQuery("INSERT INTO Inning(inning_guid) VALUES('" + key + "')", function(err, result){
      console.log(err || result)
    }); //new inning
    
    /*sqlQuery("UPDATE Inning SET t_time ='" + date + "' WHERE inning_guid ='" + key + "'", function(err, result){
      console.log(err || result)
    });//set time*/
    
    sqlQuery('SELECT g_name,game_guid FROM Game', function(err, result){//joanne 20160718
      console.log('all_game')
      console.log(result)
      for(var i =0; i < result.length; i++){
        all_game_guid.push(result[i].game_guid);
      }
      //all_game_guid.push(result);
      //all_game_guid = result;
      console.log(result)
      console.log('all_game_guid')  
      //console.log(all_game_guid)
      socket.emit('qrcode', result, key);
      all_socket[key] = tv_s;
/*if(all_game_guid.length == 5){
   socket.emit('qrcode', all_game_guid, key);
      all_socket[key] = tv_s;
}*/

    });//取出所有遊戲
    
  })

  //使用者連線	
  socket.on('client', function(p_name, pic) {
    var key;//uuid
    var u_s = socket;//socket 
    console.log('這個人的名字：' + p_name + '這個人的照片' + pic);
    console.log("玩家的連線" + u_s);

    //刪掉目前offline的人
    sqlQuery("DELETE from Inning_user where online ='" + 0 + "'");

    //此局的名字
    var g_name = '';
    var g_data = sqlQuery("SELECT * from Game where game_guid ='" + player_g + "'");
        g_name = g_data[0].g_name;
        console.log("名字是：" + g_name);
        console.log("這是遊戲的最少人數" + g_data[0].g_p_less);

    //找資料庫有沒有這個人，不然就新增 *先判斷inning_user 在判斷user
    var result = sqlQuery("SELECT * from Inning_user where user_account ='" + p_name + "' AND user_pic = '" + pic + "' AND online='1' ");
    if(result[0] == undefined && p_name != ''){//這個人不在inning_user資料表中
      console.log('這個人不在inning_user資料表中')
      var result_1 = sqlQuery("SELECT * from User where account ='" + p_name + "'");
      if(result_1[0] == undefined && p_name != ''){//這個人不在user資料表中
        console.log('這個人不在user資料表中')
        key = uuid.v4();
        var insert_u = sqlQuery("INSERT INTO User(user_guid,account,pic) VALUES('" + key + "','" + p_name + "','" + pic + "')");
        console.log(player_g);
        console.log(player_i);


        var sum = '';//遊戲目前總人數
        var result_2 = sqlQuery("SELECT COUNT(*) as sum from inning_user where inning_gref='" + player_i + "'AND game_guid='" + player_g + "'AND online=1");
            sum = result_2[0].sum;
        console.log("總人數：" + sum);
        if(sum == 0){//判斷遊戲內人數
          socket.broadcast.emit('tv_change', player_i, player_g, g_name);
          //把此人選的遊戲guid放入此局
          var sql_u = sqlQuery("UPDATE Inning SET g_gref ='" + player_g + "' WHERE inning_guid ='" + player_i + "'");
          var key_iu = uuid.v4();
          //把此人加入inning_user 資料表
          var sql_iu = sqlQuery("INSERT INTO Inning_user(iu_guid,inning_gref,game_guid, user_gref,user_account,user_pic) VALUES('" + key_iu + "','" + player_i + "','" + player_g + "','" + key + "','" + p_name + "','" + pic + "')");
          socket.emit('client_change', p_name, key, player_i, g_data, sum);
          console.log('電視連線：' + all_socket[player_i]);
          all_socket[player_i].emit('tv_newplayer', p_name);
        } else if((sum + 1) >= g_data[0].g_p_less && (sum + 1) < g_data[0].g_p_more) {//答到開始遊戲人數最低標準
          socket.emit('client_change', p_name, key, player_i, g_data, sum);
          all_socket[player_i].emit('tv_newplayer', p_name);
          socket.emit('decide'); //問他要不要開始
        } else if((sum + 1) == g_data[0].g_p_more){//人數剛好
          game_start(key, p_name, pic); //開始遊戲
          socket.emit('client_change', p_name, key, player_i, g_data, sum);
          all_socket[player_i].emit('tv_newplayer', p_name);
        } else if(sum >= g_data[0].g_p_more){//人數超過
          socket.emit('join_failed');//無法加入遊戲
        }

      } else{//此人加入inning_user資料表 
        var key_iu = uuid.v4();
        var sql_iu = sqlQuery("INSERT INTO Inning_user(iu_guid,inning_gref,game_guid, user_gref,user_account,user_pic) VALUES('" + key_iu + "','" + player_i + "','" + player_g + "','" + key + "','" + p_name + "','" + pic + "')");
        socket.emit('client_change', p_name, key, player_i, g_data, sum);
        all_socket[player_i].emit('tv_newplayer', p_name, key);
        socket.broadcast.emit('tv_change', player_i, player_g, g_name);
      }
      all_socket[key] = u_s;//把這個人的socket存起來
      console.log("所有的all_socket：" + all_socket);

    } else{//這個人在inning_user資料表中
       //把資料庫的這個人刪掉，新增這個人
      var del = sqlQuery("DELETE from Inning_user where user_account ='" + p_name + "'");//delete
      var this_user = sqlQuery("SELECT * from User where account ='" + p_name + "'");//這人在線上
      key = this_user[0].user_guid;
      

        var sum = '';//遊戲目前總人數
        var result_2 = sqlQuery("SELECT COUNT(*) as sum from inning_user where inning_gref='" + player_i + "'AND game_guid='" + player_g + "'AND online=1");
            sum = result_2[0].sum;
        console.log("總人數：" + sum);
        if(sum == 0){//判斷遊戲內人數
          socket.broadcast.emit('tv_change', player_i, player_g, g_name);
          //把此人選的遊戲guid放入此局
          var sql_u = sqlQuery("UPDATE Inning SET g_gref ='" + player_g + "' WHERE inning_guid ='" + player_i + "'");
          var key_iu = uuid.v4();
          //把此人加入inning_user 資料表
          var sql_iu = sqlQuery("INSERT INTO Inning_user(iu_guid,inning_gref,game_guid, user_gref,user_account,user_pic) VALUES('" + key_iu + "','" + player_i + "','" + player_g + "','" + key + "','" + p_name + "','" + pic + "')");
          socket.emit('client_change', p_name, key, player_i, g_data, sum);
          console.log('電視連線：' + all_socket[player_i]);
          all_socket[player_i].emit('tv_newplayer', p_name);
        } else if((sum + 1) >= g_data[0].g_p_less && (sum + 1) < g_data[0].g_p_more) {//答到開始遊戲人數最低標準
          socket.emit('client_change', p_name, key, player_i, g_data, sum);
          all_socket[player_i].emit('tv_newplayer', p_name);
          socket.emit('decide'); //問他要不要開始
        } else if((sum + 1) == g_data[0].g_p_more){//人數剛好
          game_start(key, p_name, pic); //開始遊戲
          socket.emit('client_change', p_name, key, player_i, g_data, sum);
          all_socket[player_i].emit('tv_newplayer', p_name);
        } else if(sum >= g_data[0].g_p_more){//人數超過
          socket.emit('join_failed');//無法加入遊戲
        } else{//此人加入inning_user資料表 
        var key_iu = uuid.v4();
        var sql_iu = sqlQuery("INSERT INTO Inning_user(iu_guid,inning_gref,game_guid, user_gref,user_account,user_pic) VALUES('" + key_iu + "','" + player_i + "','" + player_g + "','" + key + "','" + p_name + "','" + pic + "')");
        socket.emit('client_change', p_name, key, player_i, g_data, sum);
        all_socket[player_i].emit('tv_newplayer', p_name, key);
        socket.broadcast.emit('tv_change', player_i, player_g, g_name);
      }
      all_socket[key] = u_s;//把這個人的socket存起來
      console.log("所有的all_socket：" + all_socket);
    }
  })

  //斷線處理
  socket.on('disconnect', function() { //是誰斷線了？哪一局 哪個遊戲 的 哪個人？
    console.log('獲得斷線事件receive disconnect event');



    console.log('這個人的socket是：' + socket);
    console.log('必須作處理');




    var g_name = '';
    var g_data = '';
    var sql_g_name = "SELECT * from Game where game_guid ='" + player_g + "'";

    db.query(sql_g_name, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }

      g_data = result;
      //g_name = g_data[0].g_name;
      console.log("名字是：" + g_name);
      //console.log("這是遊戲的最少人數"+g_data[0].g_p_less);
    });




    var sql_p = "SELECT * from inning_user where inning_gref='" + player_i + "'AND game_guid='" + player_g + "'";

    console.log(sql_p);
    db.query(sql_p, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      var d = '';
      for (var i = 0; i < result.length; i++) {
        if (all_socket[result[i].user_gref] == socket) {
          console.log('找到斷線的人，他的guid是：' + result[i].user_gref + '名字是：' + result[i].user_account);
          d = result[i].user_gref; // 這個人的gref

          //更新這個人的online狀態為false
          var sql_score = "UPDATE Inning_user SET online='" + 0 + "' WHERE user_gref ='" + d + "'";

          console.log(sql_score);
          db.query(sql_score, function(err, result) {
            if (err) {
              console.log(err);
              return;
            }
            console.log(result);
          });

          var sql_p_sum = "SELECT COUNT(*) as sum from inning_user where inning_gref='" + player_i + "'AND game_guid='" + player_g + "'AND online=1";
          console.log(sql_p_sum);
          db.query(sql_p_sum, function(err, result) {
            if (err) {
              console.log(err);
              return;
            }
            console.log(result);
            sum = result[0].sum;
            console.log("斷線之後的總人數：" + sum);



            if (sum < g_data[0].g_p_less) {
              var people_guid = over();

            }



          });

        }
      }


    });
  })

  socket.on('g_start', function(u_guid, u_name, pic, number) { //直接開始
    flip_select_number = number;
    game_start(u_guid, u_name, pic);
    socket.emit('div_hide');
    all_socket[player_i].emit('tv_newplayer', u_name, u_guid);
  })

  socket.on('wait_other', function(u_guid, u_name, pic) { //把這個人加進遊戲中
    //如果這個人已經在user_guid裡面了 而且在線上了，就不用加
    console.log('等待別人的資料：' + u_guid, u_name, pic);
    var sql_iu = "SELECT user_account from Inning_user where inning_gref ='" + player_i + "' AND online ='" + 1 + "' AND game_guid='" + player_g + "' AND user_gref='" + u_guid + "'";
    console.log(sql_iu);
    db.query(sql_iu, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);

      if (result[0] == undefined) {
        var key_iu = uuid.v4();
        console.log(key_iu);
        var sql_iu = "INSERT INTO Inning_user(iu_guid,inning_gref,game_guid, user_gref,user_account,user_pic, online) VALUES('" + key_iu + "','" + player_i + "','" + player_g + "','" + u_guid + "','" + u_name + "','" + pic + "','" + 1 + "')";
        console.log(sql_iu);
        db.query(sql_iu, function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);
        });
        socket.emit('div_hide');
        all_socket[player_i].emit('tv_newplayer', u_name, u_guid, player_i, player_g);
      } else {
        socket.emit('div_hide');
        all_socket[player_i].emit('tv_newplayer', u_name, u_guid, player_i, player_g);
      }

    });
  })

  socket.on('sendID', function(players, p, card_id, dealcard) {
    console.log('可以出的牌' + dealcard);
    console.log('有人出牌：' + card_id);
    if (dealcard.length == 0) {
      all_socket[p.guid].emit('hide_card_count', card_id);
    }

    var new_data = Game_s.change_player(players, p, card_id, dealcard);
    if (new_data.end == true) {

      for (var o = 0; o < new_data.win_p.length; o++) {
        console.log('贏家的guid:' + new_data.win_p[o].guid);
      }


      var win;
      var all_name = [];
      var all_guid = [];
      //所有遊戲名稱
      db.query('SELECT g_name,game_guid FROM ' + 'Game', function(err, results, fields) {
        if (err) throw err;
        var all_game = results;
        console.log(all_game);
        for (var i = 0; i < all_game.length; i++) {
          all_guid.push(all_game[i].game_guid);
          all_name.push(all_game[i].g_name);
        }
        //socket.emit('qrcode',all_game,key);				
        console.log('所有遊戲名稱' + all_guid);
        console.log('所有遊戲名稱' + all_name);

        //最贏的人要顯示那些再一次的按鈕
        for (var w = 0; w < new_data.win_p.length; w++) {

          win = new_data.win_p[0];

        }

        for (var k = 0; k < new_data.players.length; k++) {


          all_socket[new_data.players[k].guid].emit('seven_end', players, new_data.players[k], new_data.play_p, new_data.dealcard);
          all_socket[new_data.players[k].guid].emit('g_button', all_name, all_guid, player_i);
        }


        all_socket[player_i].emit('seven_end_tv', new_data.players, win);
        add_score(20, win.guid);


      })


    } //遊戲結束了
    else {
      for (j = 0; j < new_data.players.length; j++) {
        console.log('第' + j + '個人的成績' + new_data.players[j].score);
      }

      var g;
      g = new_data.play_p.guid;
      console.log('new_data新的玩家guid:' + new_data.play_p.guid);
      console.log('現在這個人蓋牌的點數：' + new_data.p_score);


      if (new_data.play_p == p) {
        all_socket[new_data.play_p.guid].emit('choose_again', p);
      } else {
        all_socket[player_i].emit('tv_score', new_data.players, p, new_data.p_score, g);
        console.log('下一個人，可以出的牌有哪些：' + new_data.dealcard);
        if (dealcard != 0) {
          all_socket[p.guid].emit('hide_card', card_id);
          all_socket[player_i].emit('new_seven_board_tv', new_data.players, card_id);
        }


        console.log('new_data.play_p.guid' + new_data.play_p.guid);
        for (var i = 0; i < new_data.players.length; i++) {
          all_socket[new_data.players[i].guid].emit('new_player', players, new_data.players[i], new_data.play_p, new_data.dealcard);
        }

      }
    } //遊戲繼續
  })

  socket.on('walk', function(p, r_number) { //走幾步路
    console.log('這個要移動的人：' + p.name + '走幾步：' + r_number);
    all_socket[player_i].emit('show_dice_tv', r_number); //幾點，傳過去

    var new_board = Game_m.change_position(p, r_number);

    console.log('已經完成改變');
    console.log(new_board);
    console.log(new_board.players);
    console.log(new_board.script);
    console.log(new_board.players[0].position);
    console.log(new_board.players[1].position);

    for (var i = 0; i < new_board.players.length; i++) {
      if (p.guid == new_board.players[i].guid) {
        walk_number = new_board.players[i].position;
        console.log('現在走路走了多少？' + walk_number);
        console.log(new_board.position_last);

        //all_socket[ player_i ].emit('number_tv', walk_number);//幾點，傳過去

        if (walk_number > new_board.position_last) {
          for (var j = new_board.position_last; j <= walk_number; j++) {
            var s = toy_animation(p, j, walk_number);
            console.log(s);
          }
        }

        if (walk_number < new_board.position_last) {
          for (var k = new_board.position_last; k < 20; k++) {
            var s = toy_animation(p, k, walk_number);
            console.log(s);
          }
          for (var m = 0; m <= walk_number; m++) {
            var s = toy_animation(p, m, walk_number);
            console.log(s);
          }
        }
      }
    }




    if (new_board.chance != undefined) { //表示是機會命運
      console.log(new_board.chance.c);
      console.log(new_board.chance.c_p);

      all_socket[new_board.p.guid].emit('mono_game_chance', new_board.p, new_board.chance);
      all_socket[player_i].emit('chance_tv', new_board.players, new_board.p, new_board.chance);
      all_socket[player_i].emit('dice_change_tv');

    } else if (new_board.more_h == true) {
      all_socket[new_board.p.guid].emit('mono_game_more_h', new_board.players, new_board.p, new_board.script);
      all_socket[player_i].emit('more_h_tv', new_board.players, new_board.p, new_board.script);
      all_socket[player_i].emit('dice_change_tv');

    } else if (new_board.lucky == true) {
      all_socket[new_board.p.guid].emit('mono_game_lucky', new_board.players, new_board.p, new_board.script);
      all_socket[player_i].emit('mono_game_lucky_tv', new_board.players, new_board.p, new_board.position, new_board.script);
      all_socket[player_i].emit('dice_change_tv');

    } else if (new_board.free == true) {
      all_socket[new_board.p.guid].emit('mono_game_free', new_board.players, new_board.p, new_board.script);

      all_socket[player_i].emit('mono_game_newboard_tv', new_board.players, new_board.p, new_board.script, p);
      all_socket[player_i].emit('dice_change_tv');

    } else if (new_board.pay != false) {
      all_socket[new_board.p.guid].emit('mono_game_pay', new_board.players, new_board.p, new_board.pay);

      all_socket[player_i].emit('mono_game_pay_tv', new_board.players, new_board.p, new_board.pay);

      all_socket[player_i].emit('dice_change_tv');

    } else if (new_board.pay == false && new_board.chance == undefined && new_board.more_h == false) {
      all_socket[new_board.p.guid].emit('mono_game_newboard', new_board.players, new_board.p, new_board.script, new_board.price);
      all_socket[player_i].emit('mono_game_newboard_tv', new_board.players, new_board.p, new_board.script, new_board.price, p);
      all_socket[player_i].emit('dice_change_tv');

    }


    //all_socket[ player_i ].emit('mono_game_newboard', new_board.players);
  })

  socket.on('new_house', function(p) {
    console.log('這個人要蓋房子');
    var new_data = Game_m.build_house(p);
    console.log('這個地方的房子有' + new_data.house + '個');
    all_socket[p.guid].emit('house', new_data.players, new_data.p);
    all_socket[player_i].emit('house_tv', new_data.players, new_data.p);
  })

  socket.on('show_score', function(players) { //顯示所有人現在的成績


    var all_guid = []; //所有現在的guid


    //找出所有這局的人，拿出名字與成績
    var sql_s = "SELECT user_gref from Inning_user where inning_gref ='" + player_i + "' AND game_guid='" + player_g + "'";
    var all_name = [];
    var all_score = [];
    console.log(sql_s);
    db.query(sql_s, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      for (var i = 0; i < result.length; i++) {
        console.log('這是目前這個人的guid:' + result[i].user_gref);
        all_guid.push(result[i].user_gref); //把guid都放在陣列裡面
      }

      for (var j = 0; j < all_guid.length; j++) {
        all_socket[all_guid[j]].emit('show_score_hide');

        var sql = "SELECT account, score_sum from User where user_guid ='" + all_guid[j] + "'";
        console.log(sql);
        db.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);

          for (var i = 0; i < result.length; i++) {
            console.log('這是目前這個人的名字:' + result[i].account);
            console.log('這是目前這個人的成績:' + result[i].score_sum);

            all_name.push(result[i].account); //把guid都放在陣列裡面
            all_score.push(result[i].score_sum);
            //all_score.push(result[i].score_sum);//把guid都放在陣列裡面


            console.log(all_name);
            console.log(all_score);

            //console.log(all_name);
            //console.log(all_score);
          }
          all_socket[player_i].emit('all_score_tv', all_name, all_score);


        });

      }




    });
  })

  socket.on('get_money', function(p) {
    var data = Game_m.latest_money(p);
    for (var i = 0; i < data.players.length; i++) {
      all_socket[data.players[i].guid].emit('money', data.players);

    }
  })

  socket.on('change_player', function(p) {
    //在交換玩家之前確定這個人是不是已經結束遊戲了
    all_socket[player_i].emit('infor_tv');
    var end = Game_m.check_end(p); //結束了沒
    if (end.game == false) { //遊戲結束


      var all_name = [];
      var all_guid = [];
      //所有遊戲名稱
      db.query('SELECT g_name,game_guid FROM ' + 'Game', function(err, results, fields) {
        if (err) throw err;
        var all_game = results;
        console.log(all_game);
        for (var i = 0; i < all_game.length; i++) {
          all_guid.push(all_game[i].game_guid);
          all_name.push(all_game[i].g_name);
        }
        //socket.emit('qrcode',all_game,key);				
        console.log('所有遊戲名稱' + all_guid);
        console.log('所有遊戲名稱' + all_name);




        for (var i = 0; i < end.players.length; i++) {

          all_socket[end.players[i].guid].emit('end_g', end.players, end.win_p);
          all_socket[end.players[i].guid].emit('g_button', end.win_p, all_name, all_guid, player_i);
        }

        //all_socket[ end.players[i].guid ].emit('end_g', end.players, end.win_p);
        add_score(20, end.win_p.guid); //大富翁

        all_socket[player_i].emit('end_g_tv', end.players, end.win_p);

      })

    }




    if (end.game == true) {
      var user_data = Game_m.change_player(); //換一個玩家
      console.log('換' + user_data.name + '直骰子');
      all_socket[user_data.guid].emit('change_player', user_data);
      all_socket[player_i].emit('infor1_tv', end.players, user_data); //改變tv畫面
      all_socket[player_i].emit('infor_tv');
    }
  })

  socket.on('find_place', function(p) {
    console.log(p.name);
    var data = Game_m.all_place(p);
    console.log('完成了');
    all_socket[data.p.guid].emit('found_place', data.p, data.places, data.house)
  })

  socket.on('buy_city', function(p, price) {
    console.log('要買地的人是' + p.name + '這個東西多少錢' + price);
    var new_data = Game_m.change_money(p, price);
    var user_data = Game_m.change_player(); //換一個玩家
    console.log('換' + user_data.name + '直骰子');
    all_socket[user_data.guid].emit('change_player', user_data);
    console.log('現在user_data這個人的位置' + user_data.position);
    if (new_data.change == true) {
      console.log('這個人可以買');
      all_socket[new_data.p.guid].emit('buy_already', new_data.players);
      console.log('現在new_data這個人的位置' + new_data.p.position);
      all_socket[player_i].emit('buy_already_tv', new_data.players, walk_number, new_data.p);
      all_socket[player_i].emit('infor_tv'); //改變tv畫面 
    } else {
      console.log('這個人的金錢不能買');
    }
  })

  socket.on('tile_click', function(t_id, id, t_text, c_infro) {
    console.log('這個磚塊這個磚塊的t_id:' + t_id + '這個磚塊的編號id:' + id + '這個磚塊的text:' + t_text + '這個人的guid:' + c_infro);
    var new_board = Game_f.memoryFlipTile(t_id, id, t_text, c_infro);
    var next = Game_f.change_player(); //新的玩家

    var end_g = Game_f.check_end();

    if (end_g != undefined && new_board != undefined) {


      for (var k = 0; k < end_g.all_score.length; k++) { //存入成績

        add_score(end_g.all_score[k].fliped, new_board.player_obj[k].guid);
      }



      var win_name = "SELECT user_account from Inning_user where score ='" + end_g.winner + "'";
      console.log(win_name);
      db.query(win_name, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(result);

        var win_n = []; //存目前贏的人的名字
        for (var m = 0; m < result.length; m++) { //可能不止一個人贏
          win_n.push(result[m].user_account);
        }



        var all_name = [];
        var all_guid = [];
        //所有遊戲名稱
        db.query('SELECT g_name,game_guid FROM ' + 'Game', function(err, results, fields) {
          if (err) throw err;
          var all_game = results;
          console.log(all_game);
          for (var i = 0; i < all_game.length; i++) {
            all_guid.push(all_game[i].game_guid);
            all_name.push(all_game[i].g_name);
          }
          //socket.emit('qrcode',all_game,key);				
          console.log('所有遊戲名稱' + all_guid);
          console.log('所有遊戲名稱' + all_name);

          for (var j = 0; j < new_board.player_obj.length; j++) {
            all_socket[new_board.player_obj[j].guid].emit('g_over', win_n);
            all_socket[new_board.player_obj[j].guid].emit('g_button', new_board.player_obj[j], all_name, all_guid, player_i);
          }
          all_socket[player_i].emit('g_over_tv', win_n);

        })


      });
    }

    if (new_board != undefined && new_board.fliped != null) {
      console.log('這是已經可以翻過來的圖案：' + new_board.fliped);
      console.log('這個排的記錄陣列' + new_board.memory_tile_ids);
      console.log('下一個玩家' + next.new_p);
      for (var i = 0; i < new_board.player_obj.length; i++) {
        all_socket[new_board.player_obj[i].guid].emit('newboard_fliped', t_id, new_board.img, new_board.player_obj[i], new_board.player, new_board.memory_tile_ids, new_board.memory_tile_fliped);
      }
      all_socket[player_i].emit('new_tileboard_tv', t_id, new_board.img, new_board.player_obj[i], new_board.player, new_board.memory_tile_ids, new_board.player_obj);
      all_socket[player_i].emit('new_tileplayer_tv', next.new_p, new_board.player_obj);


    }

    if (new_board != undefined && new_board.fliped == null) {
      console.log('全部new_board資料' + new_board);
      console.log('這個排的id' + new_board.t_id);
      console.log('這個排的圖案' + new_board.img);
      console.log('點這個牌的玩家' + new_board.player);
      console.log('下一個玩家' + next.new_p.guid);
      console.log('下一個玩家' + new_board.player.guid);

      console.log('所有玩家' + new_board.player_obj);
      console.log('這個排的記錄陣列' + new_board.memory_tile_ids);
      for (var i = 0; i < new_board.player_obj.length; i++) {

        all_socket[new_board.player_obj[i].guid].emit('new_tileboard', t_id, new_board.img, new_board.player_obj[i], new_board.player, new_board.memory_tile_ids);
      }

      all_socket[player_i].emit('new_tileboard_tv', t_id, new_board.img, new_board.player_obj[i], new_board.player, new_board.memory_tile_ids, new_board.player_obj);
      all_socket[player_i].emit('new_tileplayer_tv', next.new_p, new_board.player_obj);

      if (new_board.memory_tile_ids.length == 2) {
        Game_f.empty();
      }
    }
  })

  socket.on('play_again', function() {
    //去資料庫找出在這個菊裡面的兩個人，在叫他們去呼叫一次selecter(players,player_i)		
    var now_players = [];
    var players_name = [];
    var sql_g_name = "SELECT user_gref, user_account from Inning_user where inning_gref ='" + player_i + "'";
    db.query(sql_g_name, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }

      for (var i = 0; i < result.length; i++) {
        now_players.push(result[i].user_gref);
        players_name.push(result[i].user_account);
        console.log("玩家名稱guid, 玩家的account：" + result[i].user_gref, result[i].user_account);
      }



      for (var i = 0; i < now_players.length; i++) {
        all_socket[now_players[i]].emit('clear_screen');
      }

      selecter(now_players, player_i, players_name);

    });
  })

  socket.on('new_g', function(tv_key, g_name, game_guid) {
      console.log('這是新的局guid:' + tv_key);
      all_socket[player_i].emit('new_g_tv', tv_key, g_name, game_guid);
  })

  socket.on('b_click', function(id, c_infro) {
    console.log('這個人的編號' + id + '這個人的資訊' + c_infro);
    var new_board = Game.change_player(id, c_infro);


    var win = Game.check_end(new_board.board, c_infro);
    //去資料庫把這人的分數改掉
    console.log('這是現在的win:' + win);
    if (win != null) {
      var all_name = [];
      var all_guid = [];
      //所有遊戲名稱




      db.query('SELECT g_name,game_guid FROM ' + 'Game', function(err, results, fields) {
        if (err) throw err;
        var all_game = results;
        console.log(all_game);
        for (var i = 0; i < all_game.length; i++) {
          all_guid.push(all_game[i].game_guid);
          all_name.push(all_game[i].g_name);
        }
        //socket.emit('qrcode',all_game,key);				
        console.log('所有遊戲名稱' + all_guid);
        console.log('所有遊戲名稱' + all_name);

        console.log('現在win不是null了');

        if (win.win_p.score == 10) { //表示有人贏了
          console.log('贏的人出現了，名字是：' + win.win_p.name + '分數是' + win.win_p.score);
          add_score(win.win_p.score, win.win_p.guid);

          for (var k = 0; k < new_board.players.length; k++) {
            all_socket[new_board.players[k].guid].emit('winner', new_board.board, win.win_p);
            all_socket[new_board.players[k].guid].emit('g_button', win.win_p, all_name, all_guid, player_i);
          }




          all_socket[player_i].emit('winner_tv', new_board.board, new_board.players, win.win_p);
        }

        if (win.win_p.score == 5) { //表示沒贏沒輸
          console.log('平手：' + win.win_p.name + '分數是' + win.win_p.score);
          for (var j = 0; j < new_board.players.length; j++) {
            add_score(win.win_p.score, new_board.players[j].guid);
            all_socket[new_board.players[j].guid].emit('deuce', new_board.board, win.win_p);
            all_socket[new_board.players[j].guid].emit('g_button', win.win_p, all_name, all_guid, player_i);
          }

          // all_socket[ win.win_p.guid ].emit('g_button', win.win_p, all_name, all_guid, player_i);


          all_socket[player_i].emit('deuce_tv', new_board.board, new_board.players, win.win_p);
        }

      })


    } else {
      //console.log('這是贏家的分數：'+ win_total_score);		
      console.log('這是新的牌局長度:' + new_board.board.length + '牌局' + new_board.board);
      for (var i = 0; i < new_board.players.length; i++) {
        all_socket[new_board.players[i].guid].emit('new_board', new_board.board);
      }

      all_socket[player_i].emit('new_board_tv', new_board.board, new_board.players);
    }
  })

  socket.on('btn_click', function(b_id, b_val, u_guid, i_d) {
    console.log('這個人的編號' + b_id + '這個人的資訊' + u_guid + '這個按鈕的值' + b_val + '這麼按鈕的編號' + i_d);
    var new_board = Game_p.change_player(i_d, b_val, u_guid);
    console.log('現在的count:' + new_board.count);
    console.log('所有玩家' + new_board.players + '現在這個玩家' + new_board.p + '現在這個玩家選擇' + i_d);
    var win = Game_p.check_end(new_board.players);
    if (new_board.count % 2 == 1) {
      console.log('線在count < 2');
      all_socket[player_i].emit('update_paper_tv', u_guid);
    } else {


      console.log('贏的人是出：' + win.win_p.val);
      console.log('贏的人成績是：' + win.win_p.score);
      console.log('所有玩家' + win.players);




      if (win.win_p.score == 10 && win.inning == 8) { //表示有人贏了
        add_score(10, win.win_p.guid);

        var all_name = [];
        var all_guid = [];
        //所有遊戲名稱
        db.query('SELECT g_name,game_guid FROM ' + 'Game', function(err, results, fields) {
          if (err) throw err;
          var all_game = results;
          console.log(all_game);
          for (var i = 0; i < all_game.length; i++) {
            all_guid.push(all_game[i].game_guid);
            all_name.push(all_game[i].g_name);
          }
          //socket.emit('qrcode',all_game,key);				
          console.log('所有遊戲名稱' + all_guid);
          console.log('所有遊戲名稱' + all_name);

          for (var k = 0; k < win.players.length; k++) {
            all_socket[win.players[k].guid].emit('end_paper');
            all_socket[win.players[k].guid].emit('g_button', all_name, all_guid, player_i);
          }
          all_socket[player_i].emit('final_end_paper_tv', win.win_p, win.players);

        })
      }



      if (win.win_p.score == 5 && win.inning == 8) {

        var all_name = [];
        var all_guid = [];
        //所有遊戲名稱
        db.query('SELECT g_name,game_guid FROM ' + 'Game', function(err, results, fields) {
          if (err) throw err;
          var all_game = results;
          console.log(all_game);
          for (var i = 0; i < all_game.length; i++) {
            all_guid.push(all_game[i].game_guid);
            all_name.push(all_game[i].g_name);
          }
          //socket.emit('qrcode',all_game,key);				
          console.log('所有遊戲名稱' + all_guid);
          console.log('所有遊戲名稱' + all_name);

          for (var d = 0; d < win.players.length; d++) {
            add_score(5, win.players[d].guid);
            all_socket[win.players[d].guid].emit('end_paper');
            all_socket[win.players[d].guid].emit('g_button', all_name, all_guid, player_i);
          }

          all_socket[player_i].emit('final_end_paper_tv', win.win_p, win.players);
        })
      }


      if (win.win_p.score == 5 && win.inning < 8) {
        for (var d = 0; d < win.players.length; d++) {
          add_score(5, win.players[d].guid);
          all_socket[win.players[d].guid].emit('paper_game_start', win.players[d]);
        }

        all_socket[player_i].emit('end_paper_tv', win.win_p, win.players);
      }


      if (win.win_p.score == 10 && win.inning < 8) {
        for (var d = 0; d < win.players.length; d++) {
          add_score(10, win.win_p.guid);
          all_socket[win.players[d].guid].emit('paper_game_start', win.players[d]);
        }

        all_socket[player_i].emit('end_paper_tv', win.win_p, win.players);
      }


    }
  })

  socket.on('leave_g', function(tv_guid, u_guid, name, game_guid) { //離開遊戲
      console.log('要離開這個人的guid是：' + u_guid);
      console.log('要換的遊戲名稱是：' + name);
      console.log('新遊戲的guid是：' + game_guid);

      var sql_p_name = "SELECT user_account from Inning_user where user_gref ='" + u_guid + "'";
      console.log(sql_p_name);
      db.query(sql_p_name, function(err, result) {
        if (err) {
          console.log(err);
          return;

        }
        console.log('這是要退出的名字' + result[0].user_account);
        all_socket[player_i].emit('tv_name_split', result[0].user_account); //電視

      });



      var sql_score = "UPDATE Inning_user SET online='" + 0 + "' WHERE user_gref ='" + u_guid + "'";

      console.log(sql_score);
      db.query(sql_score, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(result);
      });
  }) 

  socket.on('exit', function(u_guid) {
    //刪除這個人
    console.log('要離開這個人的guid是：' + u_guid);

    var sql_p_name = "SELECT user_account, game_guid from Inning_user where user_gref ='" + u_guid + "'";
    console.log(sql_p_name);
    db.query(sql_p_name, function(err, result) {
      if (err) {
        console.log(err);
        return;

      }
      console.log('這是要退出的名字' + result[0].user_account);
      console.log('這是要退出的局' + result[0].game_guid); //這個局的名字
      all_socket[player_i].emit('tv_name_split', result[0].user_account); //電視

      //找出這局的所有人
      var all_name = "SELECT user_gref from Inning_user where game_guid ='" + result[0].game_guid + "'";
      console.log(all_name);
      db.query(all_name, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        for (var s = 0; s < result.length; s++) {
          console.log('這是要退出的所有人之一' + result[s].user_gref);
          all_socket[result[s].user_gref].emit('do_exit'); //退出那個人	
        }
        var tv_sent = over();

      });

      //把這個局裡面的人都刪掉
      var sql_de = "DELETE FROM Inning_user WHERE game_guid ='" + result[0].game_guid + "'";
      console.log(sql_de);
      db.query(sql_de, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(result);
      });




    });




    //確認人數夠不夠繼續玩					
    var sql_count = "SELECT COUNT(*) as sum from inning_user where inning_gref='" + player_i + "'AND game_guid='" + player_g + "'";
    console.log(sql_count);
    db.query(sql_count, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      var sum = result[0].sum;
      console.log("這個人退出之後的總人數：" + sum);

      var sql_g_name = "SELECT * from Game where game_guid ='" + player_g + "'";
      db.query(sql_g_name, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }


        var g_data = result;
        var g_name = g_data[0].g_name;
        console.log("名字是：" + g_name);
        console.log("這是遊戲的最少人數" + g_data[0].g_p_less);
        //找出這個遊戲需要多少人玩
        if (g_data[0].g_p_less > sum) {
          var sql_g_name = "SELECT * from Inning_user where inning_gref ='" + player_i + "'";
          db.query(sql_g_name, function(err, result) {
            if (err) {
              console.log(err);
              return;
            }

            for (var i = 0; i < result.length; i++) {
              console.log(result[i].user_gref);
              all_socket[result[i].user_gref].emit('exit_hide'); //隱藏那個人的退出資訊
            }
          });
          all_socket[u_guid].emit('do_exit'); //退出那個人	
          all_socket[player_i].emit('not_enough_tv', player_i, player_g, g_name); //電視			
        }
        //人數夠就可以繼續玩	
        else {

          all_socket[u_guid].emit('do_exit'); //退出那個人

        }
      });

    });
  })

});
//socketCtrl.socketOn(io,uuid, all_inning, db, dbAccessModule);