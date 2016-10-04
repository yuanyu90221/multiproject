//var dbAccessModule = require('./dbAccessModule');
var GameDao = require('./dao/gameDao');
var InningDao = require('./dao/inningDao');
var InningVo = require('./dao/inning');
var Inning_User = require('./dao/inning_User');
var Inning_UserDao = require('./dao/inning_UserDao');
var UserVo = require('./dao/user');
var UserDao = require('./dao/userDao');
var Game = require('../ox_game'),
    Game_f = require('../flip_game'),
    Game_p = require('../paper_game'),
    Game_m = require('../mono_game'),
    Game_s = require('../seven_game');
var all_socket  = {};
var flip_select_number='';

module.exports = {
	'socketOn': function(io, uuid, all_inning, all_game_guid){
		console.log("start");
		function game_start(key, p_name, pic){//遊戲開始呼叫的function
									//此人加入inning_user資料表
				var key_iu=uuid.v4();
				console.log(key_iu);
				var inning_1 = new Inning_User({iu_guid:key_iu,
	 	                          inning_gref:player_i,
	 	                          game_guid:player_g,
	 	                          user_gref:key,
	 	                          user_account:p_name,
	 	                          user_pic:pic,
	 	                          online:1
	 	                       });

				Inning_UserDao.insertInningUser(inning_1, function(err, result){
					if(err){
						console.log(err);
						return ;
					}
					console.log(result);
					//找出這個遊戲的所有guid,拿出map的資料,傳給選擇器
					var now_players =[];
					var players_name =[];
					var players_pic =[];
					Inning_UserDao.queryByCriteria({inning_gref:player_i,online:1, game_guid:player_g}, function(err, data_result){
						if(err){
							console.log(err);
							return ;
						}
						for(var i=0; i<data_result.length; i++){
							now_players.push(data_result[i].user_gref);
							players_name.push(data_result[i].user_account);
							players_pic.push(data_result[i].user_pic);
							console.log("玩家名稱guid與name："+ data_result[i].user_gref, data_result[i].user_account);
						}

						console.log('所有玩家的guid:'+now_players);
						console.log('所有玩家的name:'+players_name);
						selecter(now_players, player_i, players_name, players_pic, flip_select_number);
					});
				});
		}

		function selecter(players, player_i, players_name, players_pic, flip_select_number){

			console.log('兩個參數'+players+'一個電視'+player_i);
			console.log('進入selecter函數');

			if(player_g =='313d4029-7bc5-454d-ac2b-a3d5dee5e60b'){
				var data = new Game_f.newBoard(players, players_name, flip_select_number);
				//把它設定為沒有值
				console.log('資料陣列'+data.tiles);

				points(players);

				for(var i=0;i<data.players.length;i++){
					console.log('這個玩家的guid：'+data.players[i].guid);
					console.log('先開始的人'+data.str_p.guid + '他的名字'+ data.str_p.name);
					all_socket[ data.players[i].guid ].emit('show_tiles', data.tiles, data.players[i].guid,data.str_p, data.str_p.name, data.players, flip_select_number);
				}
				all_socket[ player_i ].emit('show_tiles_tv' ,data.tiles, players[i],data.str_p, data.str_p.name, data.players, flip_select_number);
				flip_select_number ='';
			}



			if(player_g == 'aea3d281-a111-4272-b4a4-77863c090fef'){
				var action = new Game.set_game(players, player_i, players_name); //action 是所有的player與裡面的資料
				console.log('接收資料'+ action);

				points(players);

				for(var i=0;i<action.players.length; i++){
					console.log('這個玩家的guid：'+action.players[i].guid);
					console.log('這個玩家的pic：'+action.players[i].pic);
					console.log('這個遊戲誰先開始：'+action.str_p.guid);

					all_socket[ action.players[i].guid ].emit('ox_game_start', action.players[i], action.str_p.guid);
				}
				all_socket[ player_i ].emit('ox_game_start_tv', action.str_p, action.players);

			}


			if(player_g == '67af5ab1-a004-41a2-b9e4-74733f0c765f'){
				var action = new Game_p.set_game(players, player_i, players_name);
				console.log('接收資料'+ action);
				points(players);

				for(var i=0;i<action.players.length; i++){
					all_socket[ action.players[i].guid ].emit('paper_game_start',action.players[i]);
				}
				all_socket[ player_i ].emit('paper_game_start_tv',action.players);


			}


			if(player_g == '27b38a5bde-89fd-44ba-9cf4-c3cf76866f95'){
				var action = new Game_m.set_game(players, player_i, players_name, players_pic);
				console.log('第一個要骰子的人是'+action.str_p.name+'這個人現在的位置是'+action.str_p.position);

				for(var i=0;i<action.players.length; i++){
					all_socket[ action.players[i].guid ].emit('mono_game_start',action.players[i], action.str_p);
				}

				all_socket[ player_i ].emit('mono_game_start_tv',action.players, action.str_p);

			}


			if(player_g == '0c4aecb4-da19-4ece-b40e-e48c3f3d7bc2'){//排七
				var action = new Game_s.newGame(players, player_i, players_name, players_pic);
				console.log('這是排七一開始回傳的資料：' + action.players
				+'開始得人：'+ action.start_p);

				for(var j=0; j< action.start_p.card.length; j++){
					console.log(action.start_p.card[j]);
				}

				console.log(action.card_c_deal);


				for(var i=0; i<action.players.length; i++){//傳給所有人

					all_socket[ action.players[i].guid ].emit('seven_game_start', action.players, action.players[i], action.start_p, action.card_c_deal);
				}
				all_socket[ action.start_p.guid ].emit('card_infro', action.card_c_deal);//是一個array
				all_socket[ player_i ].emit('seven_game_start_tv', action.players, action.start_p);
			}
		}

		function points(players){
	  			for(var j=0;j< players.length; j++){
				var all_score = [];//所有人的成績（之前的）
				Inning_UserDao.queryByCriteria({user_gref:players[j], game_guid: player_g}, function(err, data_result){
					if(err){
						console.log(err);
						return ;
					}
					var name = data_result[0].score;
					console.log('這個人目前成績'+ data_result[0].score);
					all_socket[ player_i ].emit('score_before_tv' , data_result[0].score);
				});
			}
  		}

  		function over(){//剩下的所有玩家
			console.log('遊戲over的function');


			var g_name='';
			var g_data ='';
			GameDao.queryByCriteria({game_guid:player_g}, function(err, data_result){
				if(err){
					console.log(err);
					return ;
				}
				g_data = data_result;
				g_name = g_data[0].g_name;
				console.log("名字是："+g_name);
				Inning_UserDao.queryByCriteria({inning_gref:player_i,game_guid:player_g,online:1}, function(err, data_result_1){
					if(err){
						console.log(err);
						return ;
					}
					console.log('現在的result是：'+ data_result_1);
					console.log('現在的result[0]是：'+ data_result_1[0]);
					if(data_result_1[0] == undefined ){
						GameDao.queryByCriteria({}, function(err, cur_result){
							if(err){
								console.log(err);
								return ;
							}
							var all_game = cur_result;
							console.log(all_game);

							all_socket[ player_i ].emit('qrcode',all_game,player_i);
						});
					}
					else{
						all_socket[ data_result_1[0].user_gref ].emit('not_enough_p'); //遊戲結束
						all_socket[ player_i ].emit('not_enough_tv', player_i, player_g, g_name);//給電視
					}
				});
			});
		}
				//連線開始
		io.sockets.on('connection', function(socket) {

		  //console.log(dbAccessModule);
		  console.log('connection');
		  //console.log(app);
		  //電視連線
		  socket.on('tv', function() {
		    var tv_s = socket;
		    console.log("新的ㄧ台電視連線");

		    var date = new Date().toLocaleString(); //現在的時間
		    console.log('現在的時間' + date);

		    var key = uuid.v4();//產生key
		    all_inning.push(key);//所有電視的key

		    var inning = new InningVo();
		    inning.setInning_guid(key);
		    InningDao.insertInning(inning, function(err, result, db){

		    	 console.log(err || result);
		    	 db.close();
		    	 GameDao.queryByCriteria({},function(err, result){
					    if(err)
					        throw err;
					    console.log('all_game');
					    console.log(result);

					    for(var i =0; i < result.length; i++){
					        all_game_guid.push(result[i].game_guid);
					    }
					    console.log('all_game_guid');
					    socket.emit('qrcode', result, key);
					    console.log(key);
					    console.log(all_socket);
					    console.log(tv_s);
			      		all_socket[key] = tv_s;
			      		console.log('key', key);
			      		console.log(all_socket[key]);
					}
			    );//取出所有遊戲
		    });// new inning
		    /*dbAccessModule.sqlQuery("UPDATE Inning SET t_time ='" + date + "' WHERE inning_guid ='" + key + "'", function(err, result){
		      console.log(err || result)
		    });//set time*/

		});

		  //使用者連線
		  socket.on('client', function(p_name, pic) {
		    var key;//uuid
		    var u_s = socket;//socket
		    console.log('這個人的名字：' + p_name + '這個人的照片' + pic);
		    console.log("玩家的連線" + u_s);

		    //刪掉目前offline的人
		    // dbAccessModule.sqlQuery("DELETE from Inning_user where online ='" + 0 + "'", null , db);
		    Inning_UserDao.deleteByCriteria({online:0},function(err, result){
		    	console.log(err||result);
		    		var g_name;
	    		    GameDao.queryByCriteria({game_guid:player_g},function(err, g_data){
					    if(err)
					        throw err;
					    console.log('all_game');
					    console.log(g_data);
					    if(g_data.length > 0){
	                    	console.log("名字是：" + g_data[0].g_name);
	                    	console.log("這是遊戲的最少人數" + g_data[0].g_p_less);
	                    	g_name = g_data[0].g_name;
	                	}

	                	//找資料庫有沒有這個人，不然就新增 *先判斷inning_user 在判斷user
					    // var result = dbAccessModule.sqlQuery("SELECT * from Inning_user where user_account ='" + p_name + "' AND user_pic = '" + pic + "' AND online='1' ");
					    Inning_UserDao.queryByCriteria({user_account:p_name,user_pic:pic,online:1},function(err, result){
					    	    if(result[0] == undefined && p_name != ''){//這個人不在inning_user資料表中
					      			console.log('這個人不在inning_user資料表中');
					      			UserDao.queryByCriteria({account:p_name}, function(err, result_list){
					      				if(result_list[0] == undefined && p_name != ''){//這個人不在user資料表中
					      					 console.log('這個人不在user資料表中');
					      					  var key = uuid.v4();
					      					  var nUser = new UserVo();
					      					  nUser.setUser_guid(key);
					      					  nUser.setAccount(p_name);
					      					  nUser.setPic(pic);
					      					  UserDao.insertUser(nUser,function(err, result){
					      					  	console.log(result);
					      					  	Inning_UserDao.queryByCriteria({inning_gref:player_i,game_guid:player_g,online:1},function(err, sumList){
						       						var sum = 0;
						       						sum = sumList.length;
						       						console.log("總人數：" + sum);

						       						if(sum == 0){//判斷遊戲內人數
														socket.broadcast.emit('tv_change', player_i, player_g, g_name);
														//把此人選的遊戲guid放入此局
														Inning_UserDao.updateByCriteria(function(err, result, db){
															db.close();
															var key_iu = uuid.v4();
															var inning_2 = new Inning_User({iu_guid:key_iu,
								      					 	                          inning_gref:player_i,
								      					 	                          game_guid:player_g,
								      					 	                          user_gref:key,
								      					 	                          user_account:p_name,
								      					 	                          user_pic:pic,
								      					 	                          online: 1
								      					 	                       });
															Inning_UserDao.insertInningUser(inning_2, function(err, result){
								      					 		socket.emit('client_change', p_name, key_iu, player_i, g_data, sum);
								      					 		console.log('電視連線：' + all_socket[player_i]);
								        						all_socket[player_i].emit('tv_newplayer', p_name, key_iu);
								        						socket.broadcast.emit('tv_change', player_i, player_g, g_name);
								      						});

														},{inning_guid:player_i},{g_gref:player_g});
						       						} else if((sum + 1) >= g_data[0].g_p_less && (sum + 1) < g_data[0].g_p_more) {//答到開始遊戲人數最低標準
														socket.emit('client_change', p_name, key, player_i, g_data, sum);
														all_socket[player_i].emit('tv_newplayer', p_name);
														socket.emit('decide'); //問他要不要開始
						       						} else if((sum + 1) == g_data[0].g_p_more){//人數剛好
														game_start(key, p_name, pic); //開始遊戲
														socket.emit('client_change', p_name, key, player_i, g_data, sum);
														all_socket[player_i].emit('tv_newplayer', p_name);
						       						}else if(sum >= g_data[0].g_p_more){//人數超過
											          socket.emit('join_failed');//無法加入遊戲
											        } else{//此人加入inning_user資料表
											        	var key_iu = uuid.v4();
								      					var inning_1 = new Inning_User({iu_guid:key_iu,
								      					 	                          inning_gref:player_i,
								      					 	                          game_guid:player_g,
								      					 	                          user_gref:key,
								      					 	                          user_account:p_name,
								      					 	                          user_pic:pic,
								      					 	                          online: 1
								      					 	                       });
                                                        sum++;
								      					Inning_UserDao.insertInningUser(inning_1, function(err, result){
								      					 	socket.emit('client_change', p_name, key, player_i, g_data, sum);
								        					all_socket[player_i].emit('tv_newplayer', p_name, key);
								        					socket.broadcast.emit('tv_change', player_i, player_g, g_name);
								      					});
											        }

						       					});// queryInningUserEnd
					      					 });//insertUser end
					      				}
					      				else{//此人加入inning_user資料表
					      					 var key_iu = uuid.v4();
					      					 	Inning_UserDao.queryByCriteria({inning_gref:player_i,game_guid:player_g,online:1},function(err, sumList){
						       						var sum = 0;
						       						sum = sumList.length;
						       						console.log("總人數：" + sum);
							      					 var inning_1 = new Inning_User({iu_guid:key_iu,
							      					 	                          inning_gref:player_i,
							      					 	                          game_guid:player_g,
							      					 	                          user_gref:key,
							      					 	                          user_account:p_name,
							      					 	                          user_pic:pic,
							      					 	                          online:1
							      					 	                       });

							      					 Inning_UserDao.insertInningUser(inning_1, function(err, result){
							      					 	socket.emit('client_change', p_name, key_iu, player_i, g_data, sum);
							      					 	console.log("player_i: ");
							      					 	console.log(player_i);
							      					 	console.log(all_socket[player_i]);
							        					all_socket[player_i].emit('tv_newplayer', p_name, key);
							        					socket.broadcast.emit('tv_change', player_i, player_g, g_data[0].g_name);
							      					 });
					      						});

					      				}//else end
					      				all_socket[key_iu] = u_s;//把這個人的socket存起來
					     				console.log("所有的all_socket：" + all_socket);
					      			});

					      	    }
					      	    else{//這個人在inning_user資料表中
					       			//把資料庫的這個人刪掉，新增這個人
					       			Inning_UserDao.deleteByCriteria({account:p_name}, function(err, result){
					       				//query
					       				UserDao.queryByCriteria({account:p_name},function(err, userList){
					       					key = userList[0].user_guid;

					       					Inning_UserDao.queryByCriteria({inning_gref:player_i,game_guid:player_g,online:1},function(err, sumList){
					       						var sum = 0;
					       						sum = sumList.length;
					       						console.log("總人數：" + sum);

					       						if(sum == 0){//判斷遊戲內人數
													socket.broadcast.emit('tv_change', player_i, player_g, g_name);
													//把此人選的遊戲guid放入此局
													Inning_UserDao.updateByCriteria(function(err, result, db){
														db.close();
														var key_iu = uuid.v4();
														var inning_2 = new Inning_User({iu_guid:key_iu,
							      					 	                          inning_gref:player_i,
							      					 	                          game_guid:player_g,
							      					 	                          user_gref:key,
							      					 	                          user_account:p_name,
							      					 	                          user_pic:pic,
							      					 	                          online:1
							      					 	                       });
														Inning_UserDao.insertInningUser(inning_2, function(err, result){
							      					 		socket.emit('client_change', p_name, key, player_i, g_data, sum);
							        						all_socket[player_i].emit('tv_newplayer', p_name, key);
							        						socket.broadcast.emit('tv_change', player_i, player_g, g_name);
							      						});

													},{inning_guid:player_i},{g_gref:player_g});
					       						} else if((sum + 1) >= g_data[0].g_p_less && (sum + 1) < g_data[0].g_p_more) {//答到開始遊戲人數最低標準
													socket.emit('client_change', p_name, key, player_i, g_data, sum);
													all_socket[player_i].emit('tv_newplayer', p_name);
													socket.emit('decide'); //問他要不要開始
					       						} else if((sum + 1) == g_data[0].g_p_more){//人數剛好
													game_start(key, p_name, pic); //開始遊戲
													socket.emit('client_change', p_name, key, player_i, g_data, sum);
													all_socket[player_i].emit('tv_newplayer', p_name);
					       						}else if(sum >= g_data[0].g_p_more){//人數超過
										          socket.emit('join_failed');//無法加入遊戲
										        } else{//此人加入inning_user資料表
										        	var key_iu = uuid.v4();
							      					var inning_1 = new Inning_User({iu_guid:key_iu,
							      					 	                          inning_gref:player_i,
							      					 	                          game_guid:player_g,
							      					 	                          user_gref:key,
							      					 	                          user_account:p_name,
							      					 	                          user_pic:pic
							      					 	                       });

							      					Inning_UserDao.insertInningUser(inning_1, function(err, result){
							      					 	socket.emit('client_change', p_name, key, player_i, g_data, sum);
							        					all_socket[player_i].emit('tv_newplayer', p_name, key);
							        					socket.broadcast.emit('tv_change', player_i, player_g, g_name);
							      					});//insert end
										        }

					       					});//inner query end
				       					});//query end
				       				});//deleteEnd
				      	    }//else end
					    });
					}
			    );//取出遊戲
		    });
		    //此局的名字
		  });//socket.on('client') end

		  //斷線處理
		  socket.on('disconnect', function() { //是誰斷線了？哪一局 哪個遊戲 的 哪個人？
		    console.log('獲得斷線事件receive disconnect event');
		    console.log('這個人的socket是：' + socket);
		    console.log('必須作處理');
		    var g_name = '';
		    var g_data = '';
		    GameDao.queryByCriteria({game_guid:player_g}, function(err, result){
				if(err){
					console.log(err);
					return;
				}
				if(result.length==0)
					return;

				var g_data = result;
				var g_name = g_data[0].g_name;
				console.log("名字是：" + g_name);
				Inning_UserDao.queryByCriteria({inning_gref:player_i,game_guid:player_g}, function(err, inningList){
					console.log(inningList);
					var d = '';
					for (var i = 0; i < inningList.length; i++) {
						if (all_socket[inningList[i].user_gref] == socket) {
							console.log('找到斷線的人，他的guid是：' + inningList[i].user_gref + '名字是：' + inningList[i].user_account);
							d = inningList[i].user_gref; // 這個人的gref
							//更新這個人的online狀態為false
							Inning_UserDao.updateByCriteria(function(err, result, db){
								db.close();
								if(err){
									console.log(err);
									return;
								}
								Inning_UserDao.queryByCriteria({inning_gref:player_i,game_guid:player_g,online:1},function(err,currentList){
									var sum = currentList.length;
									console.log("斷線之後的總人數：" + sum);
									if (sum < g_data[0].g_p_less) {
										var people_guid = over();
									}
								});
							},{user_gref:d},{online:0});
						}
					}
				});
		    });
		  });// disconnect

		  socket.on('g_start', function(u_guid, u_name, pic, number) { //直接開始
		    flip_select_number = number;
		    game_start(u_guid, u_name, pic);
		    socket.emit('div_hide');
		    all_socket[player_i].emit('tv_newplayer', u_name, u_guid);
		  });// g_start

		  socket.on('wait_other', function(u_guid, u_name, pic) { //把這個人加進遊戲中
		    //如果這個人已經在user_guid裡面了 而且在線上了，就不用加
		    console.log('等待別人的資料：' + u_guid, u_name, pic);

		    Inning_UserDao.queryByCriteria({inning_gref:player_i,online:1,game_guid:player_g,user_gref:u_guid},function(err, result){
		    	if (err) {
			        console.log(err);
			        return;
				}
				console.log(result);
				if (result[0] == undefined) {
					var key_iu = uuid.v4();
		        	console.log(key_iu);
		        	Inning_UserDao.insertInningUser({iu_guid:key_iu,inning_gref:player_i,game_guid:player_g,user_gref:u_guid,user_account:u_name,user_pic:pic,online:1},function(err, result1){
		        		if(err){
		        			console.log(err);
		        			return;
		        		}
		        		console.log(result1);

		        	});
				}
		      	socket.emit('div_hide');
			    all_socket[player_i].emit('tv_newplayer', u_name, u_guid, player_i, player_g);
		    });
		  });// wait_other

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
		      GameDao.queryByCriteria({},function(err, results){
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
		      });

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
		  });//sendID

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
		  });

		  socket.on('new_house', function(p) {
		    console.log('這個人要蓋房子');
		    var new_data = Game_m.build_house(p);
		    console.log('這個地方的房子有' + new_data.house + '個');
		    all_socket[p.guid].emit('house', new_data.players, new_data.p);
		    all_socket[player_i].emit('house_tv', new_data.players, new_data.p);
		  });

		  socket.on('show_score', function(players) { //顯示所有人現在的成績

		    var all_guid = []; //所有現在的guid
		     //找出所有這局的人，拿出名字與成績
		    Inning_UserDao.queryByCriteria({inning_gref:player_i,game_guid:player_g},function(err, result){
		    	var all_name = [];
		    	var all_score = [];
		    	if (err) {
					console.log(err);
					return;
		        }
		        console.log(result);
		        if(result.length==0)
		        	return;

		        for (var i = 0; i < result.length; i++) {
					console.log('這是目前這個人的guid:' + result[i].user_gref);
					all_guid.push(result[i].user_gref); //把guid都放在陣列裡面
				}

				for (var j = 0; j < all_guid.length; j++) {
		        	all_socket[all_guid[j]].emit('show_score_hide');
		        	UserDao.queryByCriteria({user_guid:all_guid[i]},function(err, resultUser){
		        		if (err) {
							console.log(err);
							return;
						}
						if(resultUser.length==0)
							return;
						for (var i = 0; i < resultUser.length; i++) {
							console.log('這是目前這個人的名字:' + resultUser[i].account);
							console.log('這是目前這個人的成績:' + resultUser[i].score_sum);

							all_name.push(resultUser[i].account); //把guid都放在陣列裡面
							all_score.push(resultUser[i].score_sum);
							//all_score.push(resultUser[i].score_sum);//把guid都放在陣列裡面

							console.log(all_name);
							console.log(all_score);

							//console.log(all_name);
							//console.log(all_score);
						}
						all_socket[player_i].emit('all_score_tv', all_name, all_score);

		        	});
		        }
		    });


		  });// show_score

		  socket.on('get_money', function(p) {
		    var data = Game_m.latest_money(p);
		    for (var i = 0; i < data.players.length; i++) {
		      all_socket[data.players[i].guid].emit('money', data.players);

		    }
		  });//get_money

		  socket.on('change_player', function(p) {
		    //在交換玩家之前確定這個人是不是已經結束遊戲了
		    all_socket[player_i].emit('infor_tv');
		    var end = Game_m.check_end(p); //結束了沒
		    if (end.game == false) { //遊戲結束

		      var all_name = [];
		      var all_guid = [];
		      //所有遊戲名稱
		      GameDao.queryByCriteria({},function(err, results){
		      	if(err) throw err;
		      	var all_game = results;
		      	console.log(all_game);
		      	if(all_game.length==0)
		      		return;

		      	for(var i = 0; i < all_game.length; i++){
					all_guid.push(all_game[i].game_guid);
					all_name.push(all_game[i].g_name);
		      	}
		      	console.log('所有遊戲名稱' + all_guid);
		        console.log('所有遊戲名稱' + all_name);
	            for (var i = 0; i < end.players.length; i++) {

		          all_socket[end.players[i].guid].emit('end_g', end.players, end.win_p);
		          all_socket[end.players[i].guid].emit('g_button', end.win_p, all_name, all_guid, player_i);
		        }
		        add_score(20, end.win_p.guid); //大富翁

		        all_socket[player_i].emit('end_g_tv', end.players, end.win_p);

		      });

		    }

		    if (end.game == true) {
		      var user_data = Game_m.change_player(); //換一個玩家
		      console.log('換' + user_data.name + '直骰子');
		      all_socket[user_data.guid].emit('change_player', user_data);
		      all_socket[player_i].emit('infor1_tv', end.players, user_data); //改變tv畫面
		      all_socket[player_i].emit('infor_tv');
		    }
		  });//change player

		  socket.on('find_place', function(p) {
		    console.log(p.name);
		    var data = Game_m.all_place(p);
		    console.log('完成了');
		    all_socket[data.p.guid].emit('found_place', data.p, data.places, data.house)
		  });

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
		  });

		  socket.on('tile_click', function(t_id, id, t_text, c_infro) {
		    console.log('這個磚塊這個磚塊的t_id:' + t_id + '這個磚塊的編號id:' + id + '這個磚塊的text:' + t_text + '這個人的guid:' + c_infro);
		    var new_board = Game_f.memoryFlipTile(t_id, id, t_text, c_infro);
		    var next = Game_f.change_player(); //新的玩家

		    var end_g = Game_f.check_end();

		    if (end_g != undefined && new_board != undefined) {// first case

		      for (var k = 0; k < end_g.all_score.length; k++) { //存入成績

		        add_score(end_g.all_score[k].fliped, new_board.player_obj[k].guid);
		      }
		      Inning_UserDao.queryByCriteria({score:end_g.winner}, function(err, result){
		      	 if (err) {
		          console.log(err);
		          return;
		        }
		        console.log(result);
		        if(result.length==0)
		        	return;
		        var win_n = []; //存目前贏的人的名字
		        for (var m = 0; m < result.length; m++) { //可能不止一個人贏
		          win_n.push(result[m].user_account);
		        }

		        var all_name = [];
		        var all_guid = [];
		        //所有遊戲名稱
		        GameDao.queryByCriteria({}, function(err, results){
					if (err) throw err;
					if (all_game.length == 0) return;
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
		        });// game query
		      });// InningUser query
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
		  });//tile_click

		  socket.on('play_again', function() {
		    //去資料庫找出在這個菊裡面的兩個人，在叫他們去呼叫一次selecter(players,player_i)
		    var now_players = [];
		    var players_name = [];
		    Inning_UserDao.queryByCriteria({inning_gref:player_i}, function(err, inningList){
				if (err) {
					console.log(err);
					return;
				}

				for (var i = 0; i < inningList.length; i++) {
					now_players.push(inningList[i].user_gref);
					players_name.push(inningList[i].user_account);
					console.log("玩家名稱guid, 玩家的account：" + inningList[i].user_gref, inningList[i].user_account);
				}

				for (var i = 0; i < now_players.length; i++) {
					all_socket[now_players[i]].emit('clear_screen');
				}

				selecter(now_players, player_i, players_name);

		    });
		  });// playe_again

		  socket.on('new_g', function(tv_key, g_name, game_guid) {
		      console.log('這是新的局guid:' + tv_key);
		      all_socket[player_i].emit('new_g_tv', tv_key, g_name, game_guid);
		  });

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
		  })//b_click

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

		      if ((win.win_p.score == 10 && win.inning == 8) || (win.win_p.score == 5 && win.inning == 8) ) { //表示有人贏了
		        add_score(10, win.win_p.guid);

		        var all_name = [];
		        var all_guid = [];
		        //所有遊戲名稱
		        GameDao.queryByCriteria({}, function(err, results){
					if (err) throw err;
					if(results.length==0) return;
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
		        });// query game
		      }// winner

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
		  });//btn_click

		  socket.on('leave_g', function(tv_guid, u_guid, name, game_guid) { //離開遊戲
		      console.log('要離開這個人的guid是：' + u_guid);
		      console.log('要換的遊戲名稱是：' + name);
		      console.log('新遊戲的guid是：' + game_guid);
		      Inning_UserDao.queryByCriteria({user_gref:u_guid}, function(err, result){
		      	 if (err) {
		          console.log(err);
		          return;

		        }
		        console.log('這是要退出的名字' + result[0].user_account);
		        all_socket[player_i].emit('tv_name_split', result[0].user_account); //電視
		      });
		      Inning_UserDao.updateByCriteria(function(err, result, db){
		      	 db.close();
		      	 if (err) {
		          console.log(err);
		          return;
		        }
		        console.log(result);
		      },{user_guid:u_guid},{online:0});
		  });// leave_g

		  socket.on('exit', function(u_guid) {
		    //刪除這個人
		    console.log('要離開這個人的guid是：' + u_guid);

		    Inning_UserDao.queryByCriteria({user_gref:u_guid}, function(err, result){
		    	if (err) {
			        console.log(err);
			        return;
				}
				console.log('這是要退出的名字' + result[0].user_account);
				console.log('這是要退出的局' + result[0].game_guid); //這個局的名字
				all_socket[player_i].emit('tv_name_split', result[0].user_account); //電視
				//找出這局的所有人
				Inning_UserDao.queryByCriteria({game_guid:result[0].game_guid}, function(err, result_1){
					 if (err) {
			          console.log(err);
			          return;
			        }
			        for (var s = 0; s < result_1.length; s++) {
			          console.log('這是要退出的所有人之一' + result_1[s].user_gref);
			          all_socket[result_1[s].user_gref].emit('do_exit'); //退出那個人
			        }
			        var tv_sent = over();
			        //把這個局裡面的人都刪掉
					Inning_UserDao.deleteByCriteria({game_guid:result[0].game_guid},function(err, result_2){
						if (err) {
				          console.log(err);
				          return;
				        }
				        console.log(result_2)
				        //確認人數夠不夠繼續玩
				        Inning_UserDao.queryByCriteria({inning_gref:player_i,game_guid:player_g}, function(err, sumList){
				        	 if (err) {
						        console.log(err);
						        return;
						     }
						     var sum = sumList.length;
						     console.log("這個人退出之後的總人數：" + sum);
						     GameDao.queryByCriteria({game_guid:player_g}, function(err, remainList){
						     	if (err) {
						          console.log(err);
						          return;
						        }
						        if(remainList.length==0)
						        	return;
						        var g_data = remainList;
						        var g_name = g_data[0].g_name;
						        console.log("名字是：" + g_name);
		        				console.log("這是遊戲的最少人數" + g_data[0].g_p_less);
		        				 //找出這個遊戲需要多少人玩
		        				if (g_data[0].g_p_less > sum) {
		        					Inning_UserDao.queryByCriteria({inning_gref:player_i},function(err, lastResult){
		        						 if (err) {
							              console.log(err);
							              return;
							            }

							            for (var i = 0; i < lastResult.length; i++) {
							              console.log(lastResult[i].user_gref);
							              all_socket[lastResult[i].user_gref].emit('exit_hide'); //隱藏那個人的退出資訊
							            }
		        					});

		        					all_socket[player_i].emit('not_enough_tv', player_i, player_g, g_name); //電視
		        				}
		        				all_socket[u_guid].emit('do_exit'); //退出那個人
						     });
				        });//
					});//delete end
				});//query end

		    });//
		  });

		});//exit
	}
};