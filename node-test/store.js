const knex = require('knex')(require('./knexfile'))

module.exports = {
	login ({ username, password }) {
		console.log(`login user ${username} with password ${password}`)
		return knex.schema.raw(`
			select * 
				from users
					where pass=\"${password}\" and user=\"${username}\" limit 1`
		).then((value) => {
			if (value[0].length > 0)
				return Promise.resolve()
			else
				return Promise.reject(new Error('Username or password incorect'))
		})
	},
	register ({ username, password, name, confirmPassword }) {
		if (password != confirmPassword)
			return Promise.reject(new Error('password and confirmPassword must match'))
		else if (password.length < 2)
			return Promise.reject(new Error('password must contain at ' +
				'least two characters'))
		return knex.schema.raw(`
			select * 
				from users
					where user=\"${username}\" limit 1`
		).then((value) => {
			if (value[0].length == 0)
				return knex('users').insert({user:username, pass:password, name:name})
			else
				return Promise.reject(new Error('Username already exists'))
		}).then(() => {
			Promise.resolve()
		})
	}
}
