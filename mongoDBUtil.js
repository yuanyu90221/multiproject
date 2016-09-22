//modules/dao/mongoDBUtil.js
// var selfUtil = require("../util");
var mongodb = require('mongodb');
var mongoConfig = require('./mongoConfig');
// var dbconfig1 = {};
// dbconfig1.domainName = selfUtil.util('../mongoConfig.json','domainName');
// dbconfig1.port = selfUtil.util('../mongoConfig.json','port');
// dbconfig1.user = selfUtil.util('../mongoConfig.json','user');
// dbconfig1.password = selfUtil.util('../mongoConfig.json','password');
// dbconfig1.dbname = selfUtil.util('../mongoConfig.json','dbname');
// console.log(dbconfig1);
// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname
console.log(mongoConfig);
var uri = 'mongodb://'+mongoConfig.user+':'+mongoConfig.password+'@'+mongoConfig.domainName+':'+mongoConfig.port+'/'+mongoConfig.dbname;

module.exports = {
	'uri': uri,
	'domainName' : mongoConfig.domainName,
	'port' : mongoConfig.port,
	'user' : mongoConfig.user,
	'password' : mongoConfig.password,
	'dbname' : mongoConfig.dbname,
	'useConnction' : function(tableName,callback){
		mongodb.MongoClient.connect(uri, function(err, db) {

			if(err)
				throw err;
			var collection = db.collection(tableName);
			callback(collection,db);
		});
	}
};