require('dotenv').load();

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
	res.render(__dirname + '/views/index', {currentUser:store.getUser()});
})

app.get('/index.html', (req, res) => {
	res.render(__dirname + '/views/index', {currentUser:store.getUser()});
})

app.get('/login', (req, res) => {
	res.render(__dirname + '/views/login', {currentUser:store.getUser()});
})

app.get('/register', (req, res) => {
	res.render(__dirname + '/views/register', {currentUser:store.getUser()});
})

app.get('/logout', (req, res) => {
	store.logout()
	.then(() => { 
		res.render(__dirname + '/views/index', {currentUser:store.getUser()});
	})
})

app.get('/profile', (req, res) => {
	res.render(__dirname + '/views/profile', {
		currentUser:store.getUser(),
		privilegeLevel:store.getPrivilege()
	});
})

app.get('/about', (req, res) => {
	res.render(__dirname + '/views/about', {
		currentUser:store.getUser(),
		privilegeLevel:store.getPrivilege()
	});
})

app.get('/contact', (req, res) => {
	console.log(store.getUser())
	res.render(__dirname + '/views/contact', {currentUser:store.getUser()});
})

app.post('/api/login', (req, res) => {
	store.login(
		{
			user: req.body.username,
			pass: req.body.password
		}
	)
	.then(() =>
		res.render(__dirname + '/views/profile',
				{currentUser:store.getUser()})
	)
	.catch((err) =>
		res.render(__dirname + '/views/error',
				{message: err})
	)
})

app.post('/api/register', (req, res) => {
	console.log(req.body)
	store.register(
		{
			name: req.body.name,
			user: req.body.username,
			pass: req.body.password,
			confirmPassword: req.body.confirmPassword
		}
	)
	.then(() => 
		res.render(__dirname + '/views/profile',
				{currentUser:store.getUser()})
	)
	.catch((err) => res.render(__dirname + '/views/error',
				{message: err})
	)
})

app.listen(7555, () => {
	console.log('Server running on http://localhost:7555')
})
