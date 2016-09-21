//modules/demo
var selfUtil = require("../../util");
var mongodb = require('mongodb');
var GameVo = require('../dao/game');
var dbconfig = {};
dbconfig.domainName = selfUtil.util('../mongoConfig.json','domainName');
dbconfig.port = selfUtil.util('../mongoConfig.json','port');
dbconfig.user = selfUtil.util('../mongoConfig.json','user');
dbconfig.password = selfUtil.util('../mongoConfig.json','password');
dbconfig.dbname = selfUtil.util('../mongoConfig.json','dbname');
console.log(dbconfig);
// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://'+dbconfig.user+':'+dbconfig.password+'@'+dbconfig.domainName+':'+dbconfig.port+'/'+dbconfig.dbname;

// mongodb.MongoClient.connect(uri, function(err, db) {

// 	if(err)
// 		throw err;
//     var result = [];
// 	var Game = db.collection('Game');
// 	Game.find({}).toArray(function(err, docs){

// 		//console.log(docs);
//         for(var n = 0 ;  n < docs.length; n++){
//         	var obj = new GameVo(docs[n]);
//         	//console.log(docs[n]);
//         	//console.log();
//         	result.push(obj);
//         }
//         console.log(result);
// 		db.close();
// 	});
// });

mongodb.MongoClient.connect(uri, function(err, db) {

	if(err)
		throw err;
    var result = [];
	var Game = db.collection('Game');
	Game.find({'g_name':'圈圈叉叉'}).toArray(function(err, docs){

		//console.log(docs);
        for(var n = 0 ;  n < docs.length; n++){
        	var obj = new GameVo(docs[n]);
        	//console.log(docs[n]);
        	//console.log();
        	result.push(obj);
        }
        console.log(result);
		db.close();
	});
});