//modules/dao/inning_UserDao
var InningUserVo = require('./inning_User');
var mongoDBUtil = require('../../mongoDBUtil');
module.exports = {
	'queryByCriteria' : function(criteria, callback) {
		mongoDBUtil.useConnction('Inning_user', function(collection, db) {
		    collection.find(criteria).toArray(function(err, docs) {
		    	if(err)
		    		throw err;
				var result = [];

			    for(var n = 0 ;  n < docs.length; n++){
			        var obj = new InningUserVo(docs[n]);
			        result.push(obj);
			    }

		    	callback(err, result);
		        db.close();
		    });
		});
	},
	'deleteByCriteria' : function(criteria, callback){
		mongoDBUtil.useConnction('Inning_user', function(collection, db) {
			collection.deleteMany(criteria,function(err, result){
				callback(err, result);
				db.close();
			});
		});
	},
	'insertInningUser' : function(inningUser, callback){
		mongoDBUtil.useConnction('Inning_user', function(collection, db) {
			collection.insert(inningUser, function(err, result){
				if(err)
					throw err;
				callback(err,inningUser);
				db.close();
			});
		});
	},
	'updateByCriteria': function(callback, criteria, updateAttributes){
		mongoDBUtil.useConnction('Inning_user', function(collection, db) {
			collection.updateOne(criteria, {$set: updateAttributes},
			function(err, result){
				if(err)
					throw err;
				callback(err, result, db);
				//db.close();
			});
		});
	}
};