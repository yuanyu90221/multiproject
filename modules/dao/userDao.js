//module/dao/userDao
var UserVo = require('./user');
var mongoDBUtil = require('../../mongoDBUtil');
module.exports = {
	'queryByCriteria' : function(criteria, callback) {
		mongoDBUtil.useConnction('User', function(collection, db) {
		    collection.find(criteria).toArray(function(err, docs) {
		    	if(err)
		    		throw err;
				var result = [];

			    for(var n = 0 ;  n < docs.length; n++){
			        var obj = new UserVo(docs[n]);
			        result.push(obj);
			    }

		    	callback(err, result);
		        db.close();
		    });
		});
	},
	'insertUser' : function(user, callback){
		mongoDBUtil.useConnction('User', function(collection, db) {
			collection.insert(user, function(err, result){
				if(err)
					throw err;
				callback(err,user);
				db.close();
			});
		});
	}
};