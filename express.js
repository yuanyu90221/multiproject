var express = require("express")

, app = express(), server = require('http').createServer(app), io = require('socket.io').listen(server);
//server.listen(8000); //表示localhost的網址的port
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//app.set('port', (process.env.PORT || 5000));
server.listen(port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

var Game = require('./ox_game'),
    Game_f = require('./flip_game'),
    Game_p = require('./paper_game'),
    Game_m = require('./mono_game'),
    Game_s = require('./seven_game'),
   // config = require("./mysql_config"),//連到mysql
    //db = config.db,
    uuid = require('node-uuid'),// 用來產生類似 GUID 的字串
    utilObj = require('./util'),
    all_inning = [],//所有電視的guid
    all_game_guid = [],//所有遊戲的guid
    // all_socket = {}, //MAP OBJECT 所有的socket
    player_g = '',
    player_i = '',
    path = require('path');
var routerCtrl = require('./modules/routerCtrl');
var hbs = require('hbs');

app.set('views', path.join(__dirname, '/'));
app.set('view engine','htm');
app.engine('htm', hbs.__express);
//var socketCtrl = require('./modules/socketCtrl');
//var dbAccessModule = require('./modules/dbAccessModule');

// 取得url 判斷進入哪個遊戲
routerCtrl.routerCtrl(app, port);
//使用的資料夾
app.use('/css', express.static(__dirname + '/css'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/flags', express.static(__dirname + '/all_flag'));
app.use('/js', express.static(__dirname + '/js'));
var socketCtrl = require('./modules/socketCtrl');

socketCtrl.socketOn(io,uuid, all_inning, all_game_guid);
