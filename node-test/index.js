const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')

const app = express()

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.render(__dirname + '/views/index');
})

app.get('/index.html', (req, res) => {
	res.render(__dirname + '/views/index');
})

app.get('/login', (req, res) => {
	res.render(__dirname + '/views/login');
})

app.get('/register', (req, res) => {
	res.render(__dirname + '/views/register');
})

app.get('/logout', (req, res) => {
	res.render(__dirname + '/views/index');
})

app.get('/profile', (req, res) => {
	res.render(__dirname + '/views/profile');
})

app.get('/about', (req, res) => {
	res.render(__dirname + '/views/about');
})

app.get('/contact', (req, res) => {
	res.render(__dirname + '/views/contact');
})

app.post('/api/login', (req, res) => {
	console.log(req.body)
	store.login(
		{
			username: req.body.username,
			password: req.body.password
		}
	)
	.then(() => res.render(__dirname + '/views/profile', {currentUser:req.body.username}))
	.catch((err) => res.render(__dirname + '/views/error', {
		message: err
	}))
})

app.post('/api/register', (req, res) => {
	console.log(req.body)
	store.register(
		{
			name: req.body.name,
			username: req.body.username,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword
		}
	)
	.then(() => res.render(__dirname + '/views/profile'))
	.catch((err) => res.render(__dirname + '/views/error', {
		message: err
	}))
})

app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
