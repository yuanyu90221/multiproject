var fs = require('fs'),
	sys = require('util');
exports.util = function(fileName, key){
	var configJson = {};
	try{//try catch
		var str = fs.readFileSync(fileName, 'utf8');
		configJson =  JSON.parse(str);

	}catch(e){
		sys.debug("JSON parse fails");
	}
	return configJson[key];
}