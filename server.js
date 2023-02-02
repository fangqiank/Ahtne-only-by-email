const dotenv = require('dotenv')
dotenv.config()

const expresss = require('express')
const jwt = require('jsonwebtoken')
// const sha256 = require('crypto-js/sha256')
// const hmacSHA512 = require('crypto-js/hmac-sha512')
// const Base64 = require('crypto-js/enc-base64')
const {sendMagicLInkEmail} = require('./mailer')

const app =expresss()
app.use(expresss.urlencoded({extended: true}))

const USERS = [
	{
		id: 1,
		email: 'zhangsan@mail.com',
		name: 'zhangsan'
	}
]

app.post('/login', async(req, res) => {
	const user = USERS.find(u => u.email === req.body.email)

	if(user != null){
		try{
			const token = jwt.sign({
				userId: user.id,
			}, 
			process.env.JWT_SECRET, //node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
			{expiresIn: '1h'})

			console.log(token)

			await sendMagicLInkEmail({
				email: user.email,
				token
			})
			
		}catch(ex){
			return res.send("Error loggin in.Please try again")
		}
	}

	res.send('Check your email to finish logging in')
})

app.get('/verify', (req, res) => {
	const token = req.query.token
	if(token == null)
		return res.sendStatus(401)

	try{
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
		const user = USERS.find(u => u.id === decodedToken.userId)
		res.send(`Authen as ${user.name}`)
	}catch(ex){
		res.sendStatus(401)
	}
})

app.listen(3001, () => console.log('Server is running on port: 3001'))

// crypto.subtle.generateKey({
// 	name: 'HMAC',
// 	hash: {name: 'SHA_256'}
// }, 
// true, 
// ['sign', 'verify']
// )
// .then(key => {
// 	crypto.subtle.exportKey('jwt', key)
// 		.then(exported => console.log(exported.k))
// })
