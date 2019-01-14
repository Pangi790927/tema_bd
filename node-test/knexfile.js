module.exports = {
	client: 'mysql',
	connection: {
		host : '127.0.0.1',
		user: process.env == true ? 'user' : 'root',
		password: '123',
		database: 'tema_restaurant'
	}
}