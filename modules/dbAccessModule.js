// module.exports.dBAccessModule = {
// 	var flip_select_number = '';
//   	var walk_number = '';
// 	sqlQuery: function(str, callback){//joanne 20160718
//       db.query(str, function(err, result) {
//         if (err) {
//           console.log('SQLerr');
//           console.log(err);
//           callback(err, result);
//         }
//         //成功的資訊
//         console.log('sqlQuery_data');
//         console.log(result);
//         callback(err, result);
//       });
//     },

// 	new_game_check: function(tv_guid, game_guid, db) { //進入另外一個遊戲之後是否開始的判斷

// 	    //找出這個遊戲的所有guid,拿出map的資料,傳給選擇器
// 	    var now_players = [];
// 	    var players_name = [];
// 	    var players_pic = [];
// 	    var sql_g_name = "SELECT user_gref, user_account, user_pic from Inning_user where inning_gref ='" + tv_guid + "' AND online =1 AND game_guid='" + game_guid + "'";
// 	    db.query(sql_g_name, function(err, result) {
// 	      if (err) {
// 	        console.log(err);
// 	        return;
// 	      }
// 	      for (var i = 0; i < result.length; i++) {
// 	        now_players.push(result[i].user_gref);
// 	        players_name.push(result[i].user_account);
// 	        players_pic.push(result[i].user_pic);
// 	        console.log("玩家名稱guid與name：" + result[i].user_gref, result[i].user_account);
// 	      }


// 	      console.log('所有玩家的guid:' + now_players);
// 	      console.log('所有玩家的name:' + players_name);
// 	      selecter(now_players, player_i, players_name, players_pic);
// 	    });
// 	},

// 	over: function(db, player_g) { //剩下的所有玩家
// 	    console.log('遊戲over的function');


// 	    var g_name = '';
// 	    var sql_g_name = "SELECT * from Game where game_guid ='" + player_g + "'";

// 	    db.query(sql_g_name, function(err, result) {
// 	      if (err) {
// 	        console.log(err);
// 	        return;
// 	      }

// 	      g_data = result;
// 	      g_name = g_data[0].g_name;
// 	      console.log("名字是：" + g_name);
// 	    });

// 	    var sql_people = "SELECT * from inning_user where inning_gref='" + player_i + "'AND game_guid='" + player_g + "'AND online='" + 1 + "'";

// 	    console.log(sql_people);
// 	    db.query(sql_people, function(err, result) {
// 	      if (err) {
// 	        console.log(err);
// 	        return;
// 	      }
// 	      console.log('現在的result是：' + result);
// 	      console.log('現在的result[0]是：' + result[0]);
// 	      //console.log('現在的result[0].user_gref是：'+ result[0].user_gref);

// 	      if (result[0] == undefined) {

// 	        db.query('SELECT g_name,game_guid FROM Game', function(err, results, fields) {
// 	          if (err) throw err;
// 	          var all_game = results;
// 	          console.log(all_game);

// 	          all_socket[player_i].emit('qrcode', all_game, player_i);
// 	        });

// 	      } else {

// 	        all_socket[result[0].user_gref].emit('not_enough_p'); //遊戲結束
// 	        all_socket[player_i].emit('not_enough_tv', player_i, player_g, g_name); //給電視
// 	      }
// 	    });
// 	},

// 	game_start: function(key, p_name, pic, db) { //遊戲開始呼叫的function
// 	    //此人加入inning_user資料表    
// 	    var key_iu = uuid.v4();
// 	    console.log(key_iu);
// 	    var sql_iu = "INSERT INTO Inning_user(iu_guid,inning_gref,game_guid, user_gref,user_account,user_pic, online) VALUES('" + key_iu + "','" + player_i + "','" + player_g + "','" + key + "','" + p_name + "','" + pic + "', '" + 1 + "')";
// 	    console.log(sql_iu);
// 	    db.query(sql_iu, function(err, result) {
// 	      if (err) {
// 	        console.log(err);
// 	        return;
// 	      }
// 	      console.log(result);
// 	    });
// 	    //找出這個遊戲的所有guid,拿出map的資料,傳給選擇器
// 	    var now_players = [];
// 	    var players_name = [];
// 	    var players_pic = [];
// 	    var sql_g_name = "SELECT user_gref, user_account, user_pic from Inning_user where inning_gref ='" + player_i + "' AND online ='" + 1 + "' AND game_guid='" + player_g + "'";
// 	    console.log(sql_g_name + "這是最後的資料");
// 	    db.query(sql_g_name, function(err, result) {
// 	      if (err) {
// 	        console.log(err);
// 	        return;
// 	      }
// 	      for (var i = 0; i < result.length; i++) {
// 	        now_players.push(result[i].user_gref);
// 	        players_name.push(result[i].user_account);
// 	        players_pic.push(result[i].user_pic);
// 	        console.log("玩家名稱guid與name：" + result[i].user_gref, result[i].user_account);
// 	      }

// 	      console.log('所有玩家的guid:' + now_players);
// 	      console.log('所有玩家的name:' + players_name);
// 	      selecter(now_players, player_i, players_name, players_pic, flip_select_number);
// 	    });
// 	},

// 	points: function(players, db) {
// 	    for (var j = 0; j < players.length; j++) {
// 	      var all_score = []; //所有人的成績（之前的）
// 	      var find_score = "SELECT score from Inning_user where user_gref ='" + players[j] + "' AND game_guid ='" + player_g + "'";
// 	      console.log(find_score);
// 	      db.query(find_score, function(err, result) {
// 	        if (err) {
// 	          console.log(err);
// 	          return;
// 	        }
// 	        var name = result[0].score; //這個人的成績
// 	        console.log('這個人目前成績' + result[0].score);
// 	        all_socket[player_i].emit('score_before_tv', result[0].score);

// 	      }); //+++++++++++++++++++++++++++++++     
// 	    }
// 	},

// 	selecter: function(players, player_i, players_name, players_pic, flip_select_number, db) {

// 	    console.log('兩個參數' + players + '一個電視' + player_i);
// 	    console.log('進入selecter函數');

// 	    if (player_g == '313d4029-7bc5-454d-ac2b-a3d5dee5e60b') {
// 	      var data = new Game_f.newGame(players, players_name, flip_select_number);
// 	      //把它設定為沒有值
// 	      console.log('資料陣列' + data.tiles);

// 	      points(players);


// 	      for (var i = 0; i < data.players.length; i++) {
// 	        console.log('這個玩家的guid：' + data.players[i].guid);
// 	        console.log('先開始的人' + data.str_p.guid + '他的名字' + data.str_p.name);
// 	        all_socket[data.players[i].guid].emit('show_tiles', data.tiles, data.players[i].guid, data.str_p, data.str_p.name, data.players, flip_select_number);
// 	      }
// 	      all_socket[player_i].emit('show_tiles_tv', data.tiles, players[i], data.str_p, data.str_p.name, data.players, flip_select_number);
// 	      flip_select_number = '';
// 	    }



// 	    if (player_g == 'aea3d281-a111-4272-b4a4-77863c090fef') {
// 	      var action = new Game.newGame(players, player_i, players_name); //action 是所有的player與裡面的資料
// 	      console.log('接收資料' + action);

// 	      points(players);

// 	      for (var i = 0; i < action.players.length; i++) {
// 	        console.log('這個玩家的guid：' + action.players[i].guid);
// 	        console.log('這個玩家的pic：' + action.players[i].pic);
// 	        console.log('這個遊戲誰先開始：' + action.str_p.guid);


// 	        all_socket[action.players[i].guid].emit('ox_game_start', action.players[i], action.str_p.guid);
// 	      }
// 	      all_socket[player_i].emit('ox_game_start_tv', action.str_p, action.players);

// 	    }


// 	    if (player_g == '67af5ab1-a004-41a2-b9e4-74733f0c765f') {
// 	      var action = new Game_p.newGame(players, player_i, players_name);
// 	      console.log('接收資料' + action);
// 	      points(players);

// 	      for (var i = 0; i < action.players.length; i++) {
// 	        all_socket[action.players[i].guid].emit('paper_game_start', action.players[i]);
// 	      }
// 	      all_socket[player_i].emit('paper_game_start_tv', action.players);


// 	    }


// 	    if (player_g == '27b38a5bde-89fd-44ba-9cf4-c3cf76866f95') {
// 	      var action = new Game_m.newGame(players, player_i, players_name, players_pic);
// 	      console.log('第一個要骰子的人是' + action.str_p.name + '這個人現在的位置是' + action.str_p.position);

// 	      for (var i = 0; i < action.players.length; i++) {
// 	        all_socket[action.players[i].guid].emit('mono_game_start', action.players[i], action.str_p);
// 	      }

// 	      all_socket[player_i].emit('mono_game_start_tv', action.players, action.str_p);

// 	    }


// 	    if (player_g == '0c4aecb4-da19-4ece-b40e-e48c3f3d7bc2') { //排七
// 	      var action = new Game_s.newGame(players, player_i, players_name, players_pic);
// 	      console.log('這是排七一開始回傳的資料：' + action.players +
// 	        '開始得人：' + action.start_p);

// 	      for (var j = 0; j < action.start_p.card.length; j++) {
// 	        console.log(action.start_p.card[j]);
// 	      }

// 	      console.log(action.card_c_deal);


// 	      for (var i = 0; i < action.players.length; i++) { //傳給所有人

// 	        all_socket[action.players[i].guid].emit('seven_game_start', action.players, action.players[i], action.start_p, action.card_c_deal);
// 	      }
// 	      all_socket[action.start_p.guid].emit('card_infro', action.card_c_deal); //是一個array
// 	      all_socket[player_i].emit('seven_game_start_tv', action.players, action.start_p);
// 	    }
// 	},

// 	toy_animation: function(p, position, walk_number) {
// 	    console.log("Request handler 'start' was called.");

// 	    function sleep(milliSeconds) {
// 	      var startTime = new Date().getTime();
// 	      while (new Date().getTime() < startTime + milliSeconds);
// 	    }

// 	    sleep(500);
// 	    all_socket[player_i].emit('toy_move_tv', p, position, walk_number); //幾點，傳過去

// 	    return "send animation!!!!!!!";
// 	},

// 	all_name: function(players, db) { //所有玩家的名稱
// 	    var names = []; //目前所有玩家的名稱
// 	    for (var i = 0; i < players.length; i++) {
// 	      var all_p_name = "SELECT account from User where user_guid ='" + players[i] + "'";
// 	      console.log(all_p_name);
// 	      db.query(all_p_name, function(err, result) {
// 	        if (err) {
// 	          console.log(err);
// 	          return;
// 	        }

// 	        names.push(result[0].account);
// 	        console.log('這是其中一個人的名稱：' + result[0].account);
// 	        console.log('這是目前的names陣列：' + names);
// 	        return

// 	      });
// 	    }
// 	},

// 	add_score: function(score, guid, player_g, db) {

// 	    var sql_score = "UPDATE Inning_user SET score= score + '" + score + "' WHERE user_gref ='" + guid + "' AND game_guid = '" + player_g + "'"; //存入累計成績inning user

// 	    console.log(sql_score);
// 	    db.query(sql_score, function(err, result) {
// 	      if (err) {
// 	        console.log(err);
// 	        return;
// 	      }
// 	      console.log(result);
// 	    });


// 	    var sql_s = "UPDATE User SET score_sum= score_sum + '" + score + "' WHERE user_guid ='" + guid + "'"; //存入累計成績inning user

// 	    console.log(sql_s);
// 	    db.query(sql_s, function(err, result) {
// 	      if (err) {
// 	        console.log(err);
// 	        return;
// 	      }
// 	      console.log(result);
// 	    });
// 	}
// }