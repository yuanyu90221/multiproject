//modules/sendMail.js
module.exports ={
	sendMail: function(_recipient, _subject, _html, _callback){
		var nodemailer = require('nodemailer');
		var smtpTransport = require('nodemailer-smtp-transport');
		var transporter = nodemailer.createTransport(smtpTransport({
			// host: '127.0.0.1',
			// port: 3301,
			// secure: false, // use SSL
			service : 'Gmail',
			auth: {
				user: 'y.u.a.n.yu90221@gmail.com',
				pass: '123770522'
			},
			// tls: {
		 //        rejectUnauthorized: false
		 //    }
		}));

		transporter.sendMail({
			sender: 'test@gmail.com',
			from: 'yuanyu_90221@hotmail.com',
			to: _recipient,
			subject: _subject,
			text: "Hello world ✔",
			html: _html
		}, function(err, info){
			_callback(err, info);
		});
	}
};