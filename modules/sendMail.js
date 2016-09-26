//modules/sendMail.js
module.exports ={
	sendMail: function(_recipient, _subject, _html, _callback){
		var nodemailer = require('nodemailer');
		var smtpTransport = require('nodemailer-smtp-transport');
		// var transporter = nodemailer.createTransport(smtpTransport({
		// 	// host: '127.0.0.1',
		// 	// port: 3301,
		// 	// secure: false, // use SSL
		// 	service : 'Gmail',
		// 	auth: {
		// 		user: 'y.u.a.n.yu90221@gmail.com',
		// 		pass: '123770522'
		// 	},
		// 	// tls: {
		//  //        rejectUnauthorized: false
		//  //    }
		// }));
		nodemailer.SMTP = {
		    host: "stmp.gmail.com",//server位置
		    port: 25,//可不給,預設25
		    // ssl: false,//可不給,預設false
		    // user: '帳號@gmail.com',//可不給
		    // pass: '密碼',//可不給
		    // use_authentication: true//可不給
		}
		var transporter = nodemailer.createTransport();
		transporter.sendMail({
			from: 'server@multiproject.com',
			to: _recipient,
			subject: _subject,
			text: "Hello world ✔",
			html: _html
		}, function(err, info){
			_callback(err, info);
		});
	}
};