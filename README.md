# Process Contact Form

*Handles the contact form from my developer portfolio via a serverless function. Features input sanitization, reCaptcha validation, and integration between several AWS services - Lambda, Cloudwatch, and SES*


## Installation

- Clone locally
- `npm install`
- Change `to` and `from` variables to reflect the recipient and email associated with your SES identity
- Compress and zip the contents of this folder (not the folder itself, just the contents)
- Upload the .zip to a Lambda function triggered by an API Gateway endpoint
- Input your Google reCaptcha v3 secret key as a Lambda environment variable (`recaptchaSecretKey`)


## Input

```
requestFormat = {
	"name": "",
	"email": "",
	"subject": "",
	"message": "",
	"token": {reCaptcha response} 
}
```

## Output

```
responseBody = {
	"status": {200 | 500},
	"message": ""
}
```