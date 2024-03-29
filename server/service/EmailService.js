var nodemailer = require('nodemailer');
var config = require('../config/environment');
//Parameters
//mailOptions {
//              to: email_addrss
//              subject: string
//              html:    <p> Your html
//              }
//callback:(function) (err, info)

const mailConfig = config.email;
var transporter = nodemailer.createTransport({
	service: mailConfig.provider,
	auth: {
		user: mailConfig.user,
		pass: mailConfig.pass,
	},
	tls: {
		rejectUnauthorized: false
	}
});

const mailOption = {
	from: mailConfig.user, // sender address
	to: 'to@email.com', // list of receivers
	subject: 'Subject of your email', // Subject line
	html: '<p>Your html here</p>'// plain text body
};

function EmailService(mailOptions, fnCallback) {
	if (!mailOptions.to) {
		fnCallback(new Error(mailConfig.errors.no_recipient), null);
		return;
	}
	mailOption.to = mailOptions.to;
	mailOption.subject = mailOptions.subject || '';
	mailOption.html = mailOptions.html;
	if(process.env.NODE_ENV==="development")
	{
		if(!mailOption.to.endsWith("@powersoft19.com"))
		{
			console.log("In development enviornment email will only be sent to email@powersoft19.com addresses.");
			console.log("Skipping email transmission to:"+mailOption.to);
			fnCallback(null,{});
			return;
		}
	}
	transporter.sendMail(mailOptions, function (err, info) {
		/*
         if(err)
         console.log(err);
         else
         console.log(info);
         */
		fnCallback(err, info);
	});
}
module.exports = EmailService;