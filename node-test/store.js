const knex = require('knex')(require('./knexfile'))
var username = null
var privilegeLevel = null

module.exports = {
	getUser() {
		return username
	},
	getPrivilege() {
		if (privilegeLevel === 2)
			strPriv = "admin";
		else if (privilegeLevel === 1)
			strPriv = "worker";
		else
			strPriv = "guest";
		console.log("privilege level computed: ", strPriv);
		return strPriv;
	},
	computePrivilegeLevel() {
		return new Promise(function(resolve, reject) {
			knex.schema.raw(`
				select * 
					from users user, manageri manager
						where user.id = manager.userid
								and user.user = \"${username}\"
			`).then((value) => {
				if (value[0].length > 0) {
					resolve(2);
				} else {
					return knex.schema.raw(`
						select * 
							from users user, ospatari ospatar
								where user.id = ospatar.userid
										and user.user = \"${username}\"
					`);
				}
			}).then((value) => {
				if (value[0].length > 0)
					resolve(1);
				else
					resolve(0);
			})
			.catch((err) => {
				reject(err);
			})
		});
		
	},
	login ({ user, pass }) {
		console.log(`login user ${user} with password ${pass}`)
		return knex.schema.raw(`
			select * 
				from users
					where pass=\"${pass}\" and user=\"${user}\" limit 1`
		).then(async (value) => {
			if (value[0].length > 0) {
				username = user
				console.log("user has logged in: " + username)
				privilegeLevel = await module.exports.computePrivilegeLevel()
				return Promise.resolve()
			}
			else
				return Promise.reject(new Error('Username or password incorect'))
		})
	},
	register ({ user, pass, name, confirmPassword }) {
		if (pass != confirmPassword)
			return Promise.reject(new Error('password and confirmPassword must match'))
		else if (pass.length < 2)
			return Promise.reject(new Error('password must contain at ' +
				'least two characters'))
		return knex.schema.raw(`
			select * 
				from users
					where user=\"${user}\" limit 1`
		).then((value) => {
			if (value[0].length == 0)
				return knex('users').insert({user:user, pass:pass, name:name})
			else
				return Promise.reject(new Error('Username already exists'))
		}).then(() => {
			username = user
			Promise.resolve()
		})
	},
	logout () {
		username = null
		return Promise.resolve()
	}
}
