const axios = require('axios');
const AWS = require('aws-sdk');
var ses = new AWS.SES();

var to = ['obrien.music@gmail.com'];
var from = 'obrien.music@gmail.com';

exports.handler = async (event, context, callback) => {
	console.log('Received event:', event);

	var data = JSON.parse(event.body);
	// var data = event; // for local Lambda testing

	// Validate reCaptcha
	console.log('recaptcha validation started');
	const secretKey = process.env.recaptchaSecretKey;

	const verification = await axios({
		method: 'post',
		url: 'https://google.com/recaptcha/api/siteverify',
		params: {
			"secret": secretKey,
			"response": data.token
		},
		headers: {
			"Content-Type": "application/json",
			"Accept": "*/*"
		}
	}).then(res => {
		console.log("reCaptcha status code: ", res.status);
		console.log("reCaptcha response body: ", res.data);
		return res;
	});

	if ( verification.status != 200 ) {
		return JSON.stringify({
			"status": 500,
			"message": "Sorry, I'm having trouble reaching Google reCaptcha to verify your humanity. Please refresh the page and try submitting this form again."
		})
	}
	else if ( !verification.data.success ) {
		// Handle ReCaptcha error
		return JSON.stringify({
			"status": 200,
			"message": "You failed the reCaptcha check. Please refresh the page and try submitting this form again."
		})
	} else {
		// Construct and send email
		console.log('recaptcha has been verified - email processing started')

		var params = {
			Destination: {
				ToAddresses: to
			},
			Message: {
				Body: {
					Text: {
						Data: 'Name: ' + data.name + '\nEmail: ' + data.email + '\nMessage: ' + data.message,
						Charset: 'UTF-8'
					}
				},
				Subject: {
					Data: data.subject,
					Charset: 'UTF-8'
				}
			},
			Source: from
		}
	
		console.log("ses params: ", params);

		ses.sendEmail(params, function(err, data) {
			if (err) console.log(err, err.stack);
			else console.log(data);	
		});
		
		return JSON.stringify({
			"status": 200,
			"message": "Your message has been sent - thanks for reaching out!"
		});
	}

};