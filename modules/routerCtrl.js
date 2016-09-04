module.exports.routerCtrl = function(app, player_g){
	console.log('test');
	console.log('====================================');
	app.get('/?', function(req, res) {
	  console.log('first page');
	  console.log(req.query.game);
	
	  console.log(__dirname);
	  var curpath = __dirname;
	  var rootPath = curpath.replace('\\modules','');
	  console.log(rootPath);
	  if (req.query.game == undefined) {
	    res.sendfile('/index.html',{root:rootPath});
	  } else {
	    player_g = req.query.game.split("?")[0];
	    player_i = req.query.inning;
	    console.log('這是這個遊戲的guid:' + player_g);
	    console.log('這是這個遊戲的局guid:' + player_i);
	    if (player_g == 'aea3d281-a111-4272-b4a4-77863c090fef') { //圈叉
	      res.sendfile('/index_oxx.htm',{root:rootPath});
	    }
	    if (player_g == '313d4029-7bc5-454d-ac2b-a3d5dee5e60b') { //配對遊戲
	      res.sendfile('/index_flip.htm',{root:rootPath});
	    }
	    if (player_g == '67af5ab1-a004-41a2-b9e4-74733f0c765f') { //剪刀石頭佈
	      res.sendfile('/index_paper.htm',{root:rootPath});
	    }
	    if (player_g == '27b38a5bde-89fd-44ba-9cf4-c3cf76866f95') { //大富翁
	      res.sendfile('/index_mono.htm',{root:rootPath});
	    }
	    if (player_g == '0c4aecb4-da19-4ece-b40e-e48c3f3d7bc2') { //撲克排七
	      res.sendfile('/index_seven.htm',{root:rootPath});
	    }
	  }
	});
}