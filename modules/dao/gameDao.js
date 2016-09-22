//modules/dao/gameDao.js
var mongoDBUtil = require('../../mongoDBUtil');
var GameVo = require('./game');
module.exports = {
	'queryByCriteria' : function(criteria, callback) {
		mongoDBUtil.useConnction('Game', function(collection, db) {
		    collection.find(criteria).toArray(function(err, docs) {
		    	if(err)
		    		throw err;
				var result = [];

			    for(var n = 0 ;  n < docs.length; n++){
			        var obj = new GameVo(docs[n]);
			        result.push(obj);
			    }

		    	callback(err, result);
		        db.close();
		    });
		});
	}
};