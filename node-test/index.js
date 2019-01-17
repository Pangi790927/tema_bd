require('dotenv').load();

const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
const moment = require('moment')

const app = express()

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.render(__dirname + '/views/index', {
		currentUser: store.getUser(),
		strPriv: store.getPrivilege()
	});
})

app.get('/index.html', (req, res) => {
	res.render(__dirname + '/views/index', {
		currentUser: store.getUser(),
		strPriv: store.getPrivilege()
	});
})

app.get('/login', (req, res) => {
	res.render(__dirname + '/views/login', {
		currentUser: store.getUser(),
		strPriv: store.getPrivilege()
	});
})

app.get('/register', (req, res) => {
	res.render(__dirname + '/views/register', {
		currentUser: store.getUser(),
		strPriv: store.getPrivilege()
	});
})

app.get('/logout', (req, res) => {
	store.logout()
	.then(() => { 
		res.render(__dirname + '/views/index', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege()
		})
	})
})

app.get('/profile', (req, res) => {
	res.render(__dirname + '/views/profile', {
		currentUser: store.getUser(),
		strPriv: store.getPrivilege()
	});
})

app.get('/about', (req, res) => {
	res.render(__dirname + '/views/about', {
		currentUser: store.getUser(),
		strPriv: store.getPrivilege()
	});
})

app.get('/contact', (req, res) => {
	res.render(__dirname + '/views/contact', {
		currentUser: store.getUser(),
		strPriv: store.getPrivilege()
	});
})

app.get('/delivery', (req, res) => {
	res.render(__dirname + '/views/delivery', {
		currentUser: store.getUser(),
		strPriv: store.getPrivilege()
	});
})

app.get('/admin-act', (req, res) => {
	if (store.getPrivilege() == "admin") {
		res.render(__dirname + '/views/admin-act', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege()
		})
	}
	else {
		res.render(__dirname + '/views/error', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: "You are not really an admin aren't you?"
		})
	}
})

app.get('/waiter-act', (req, res) => {
	if (store.getPrivilege() == "worker" || store.getPrivilege() == "admin") {
		res.render(__dirname + '/views/waiter-act', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege()
		})
	}
	else {
		res.render(__dirname + '/views/error', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: "I don't think you are working here"
		})
	}
})

app.post('/api/login', (req, res) => {
	store.login(
		{
			user: req.body.username,
			pass: req.body.password
		}
	)
	.then(() =>
		res.render(__dirname + '/views/profile', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege()
		})
	)
	.catch((err) =>
		res.render(__dirname + '/views/error', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: err
		})
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
		res.render(__dirname + '/views/profile', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege()
		})
	)
	.catch((err) => res.render(__dirname + '/views/error', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: err
		})
	)
})

// start admin commands

app.post('/api/insert-manager', (req, res) => {
	console.log('will insert a manager', req.body);
	store.insertManager({
		username: req.body.manager_username,
		birthday: req.body.birthday,
		employment_date: req.body.employment_date
	})
	.then(() => {
		if (store.getPrivilege() == "admin") {
			res.render(__dirname + '/views/success', {
				currentUser: store.getUser(),
				strPriv: store.getPrivilege(),
				message: `You had succeded in adding ${req.body.manager_username} as an manager/admin`
			})
		}
		else {
			res.render(__dirname + '/views/error',
					{message: "You are not really an admin aren't you?"})
		}
	})
	.catch((err) => {
		res.render(__dirname + '/views/error', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: err
		})
	})
})

app.post('/api/insert-waiter', (req, res) => {
	console.log('will insert a waiter', req.body);
	store.insertWaiter({
		waiter_username: req.body.waiter_username,
		manager_username: req.body.manager_username,
		birthday: req.body.birthday,
		employment_date: req.body.employment_date
	})
	.then(() => {
		if (store.getPrivilege() == "admin") {
			res.render(__dirname + '/views/success', {
				currentUser: store.getUser(),
				strPriv: store.getPrivilege(),
				message: `You succeded in adding ${req.body.waiter_username} as an waiter`
			})
		}
		else {
			res.render(__dirname + '/views/error', {
				currentUser: store.getUser(),
				strPriv: store.getPrivilege(),
				message: "You are not really an admin aren't you?"
			})
		}
	})
	.catch((err) => {
		res.render(__dirname + '/views/error', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: err
		})
	})
})

app.post('/api/list-managers', async (req, res) => {
	manager_list = await store.getManagerList();
	console.log('trying to send manager list', manager_list);
	res.send(JSON.stringify(manager_list));
})

app.post('/api/list-waiters', async (req, res) => {
	waiter_list = await store.getWaiterList();
	console.log('trying to send waiter list', waiter_list);
	res.send(JSON.stringify(waiter_list));
})

app.post('/api/remove-manager', async (req, res) => {
	store.removeManager({
		manager_username: req.body.manager_username
	})
	.then(() => {
		res.render(__dirname + '/views/success', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: `You succeded in remmoving ${req.body.manager_username} as an manager`
		})
	})
	.catch((err) => {
		res.render(__dirname + '/views/error', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: err
		})
	})
})

app.post('/api/remove-waiter', async (req, res) => {
	store.removeWaiter({
		waiter_username: req.body.waiter_username
	})
	.then(() => {
		res.render(__dirname + '/views/success', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: `You succeded in remmoving ${req.body.waiter_username} as an waiter`
		})
	})
	.catch((err) => {
		res.render(__dirname + '/views/error', {
			currentUser: store.getUser(),
			strPriv: store.getPrivilege(),
			message: err
		})
	})
})

// end admin commans
// start waiter commands

app.post('/api/add-command', (req, res) => {
	
})

app.post('/api/remove-command', (req, res) => {
	
})

app.listen(7555, () => {
	console.log('Server running on http://localhost:7555')
})

// end waiter commands
