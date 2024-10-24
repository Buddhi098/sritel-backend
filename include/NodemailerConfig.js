var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	auth: {
		user: 'ishanchami9@gmail.com',
		pass: 'wgppqgphujzgwecd',

	},
	tls: {
		rejectUnauthorized: false,
	},
	secure: false,
});
async function SendMail(otp, password, email) {
	return new Promise((resolve, reject) => {
		if (otp) {
			var mailOptions = {
				from: "ishanchami9@gmail.com",
				to: email,
				subject: "Verify your email",
				text: `Your OTP is ${otp} Account created successfully Your Password is "${password}"`,
			};
		}
		else {
			var mailOptions = {
                from: "ishanchami9@gmail.com",
                to: email,
                subject: "Verify your email",
                text: `Account created successfully Your Password is "${password}"`,
            };
		}
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				resolve('error');
			} else {
				resolve('emailsent');
			}
		});
	});
}



async function notification(email, package_name, package_description, package_data, package_voice, package_sms, package_price) {
    return new Promise((resolve, reject) => {
        if (email) {
            var mailOptions = {
                from: "ishanchami9@gmail.com",
                to: email,
                subject: "Package Activation Notification",
                text: `Successfully activated package ${package_name} with description ${package_description} with data limit ${package_data}, voice limit ${package_voice}, sms limit ${package_sms}, price ${package_price}.`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    resolve('error');
                } else {
                    resolve('emailsent');
                }
            });
        } else {
            resolve('error'); // Handle case where email is missing
        }
    });
}
module.exports = {SendMail, notification};
