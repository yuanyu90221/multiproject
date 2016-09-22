var db_options = {
  host     : '127.0.0.1',
  path     : 'http://localhost/phpmyadmin/',
  user     : 'root',
  password : 'dob770407',
  database: 'multi-screen'
};

var mysql = new require("mysql");

var db = null;

db = mysql.createConnection(db_options);

// db.connect(function(err) {
//     if(err) {
//         console.error(err);
//         return;
//     }
//     console.log("Mysql Connect");

// });

//將mysql的client 存入 exports
exports.db = db;

