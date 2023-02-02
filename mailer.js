const sendGridMailer = require('@sendgrid/mail')
sendGridMailer.setApiKey(process.env.SEND_GRID_API_KEY)

const sendMagicLInkEmail = async ({email, token}) => {
  try{
		await sendGridMailer.send({
			to: email,
			from: process.env.FROM_EMAIL,
			subject: 'Finish Logging In ',
			// text: 'and secure your tour',
			html: `<a href='http://localhost:3001/verify?token=${token}'>Log In</a>`
		})
	} catch(err){
		console.error(err)

    if (err.response) {
      console.error(err.response.body)
    }
	}
}

module.exports ={
	sendMagicLInkEmail
}