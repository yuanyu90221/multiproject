var selfUtil = require('./util');
var dbconfig = {};
dbconfig.host = selfUtil.util('config.json','host');
dbconfig.user = selfUtil.util('config.json','user');
dbconfig.password = selfUtil.util('config.json','password');
dbconfig.port = selfUtil.util('config.json','port');

console.log("dbconfig.host:"+dbconfig.host);
console.log("dbconfig.user:"+dbconfig.user);
console.log("dbconfig.password:"+dbconfig.password);
console.log("dbconfig.port:"+dbconfig.port);
module.exports= { 
	"host":dbconfig.host,
	"user":dbconfig.user,
	"password":dbconfig.password,
	"port":dbconfig.port
};