// modules/dao/inningDao
var InningVo = require('./inning');
var mongoDBUtil = require('../../mongoDBUtil');
module.exports = {
	'queryByCriteria' : function(criteria, callback) {
		mongoDBUtil.useConnction('Inning', function(collection, db) {
		    collection.find(criteria).toArray(function(err, docs) {
		    	if(err)
		    		throw err;
				var result = [];

			    for(var n = 0 ;  n < docs.length; n++){
			        var obj = new InningVo(docs[n]);
			        result.push(obj);
			    }

		    	callback(err, result);
		        db.close();
		    });
		});
	},
	'insertInning' : function(inning, callback){
		mongoDBUtil.useConnction('Inning', function(collection, db) {
			collection.insert(inning, function(err, result){
				if(err)
					throw err;
				callback(err,inning);
				db.close();
			});
		});
	}
};