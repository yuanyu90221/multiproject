var selfUtil = require('./util');
var mongoConfig = {};
mongoConfig.domainName = selfUtil.util('mongoConfig.json','domainName');
mongoConfig.port = selfUtil.util('mongoConfig.json','port');
mongoConfig.user = selfUtil.util('mongoConfig.json','user');
mongoConfig.password = selfUtil.util('mongoConfig.json','password');
mongoConfig.dbname = selfUtil.util('mongoConfig.json','dbname');
// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://'+mongoConfig.user+':'+mongoConfig.password+'@'+mongoConfig.domainName+':'+mongoConfig.port+'/'+mongoConfig.dbname;

module.exports = {
	'uri': uri,
	'domainName' : mongoConfig.domainName,
	'port' : mongoConfig.port,
	'user' : mongoConfig.user,
	'password' : mongoConfig.password,
	'dbname' : mongoConfig.dbname
};