const knex = require('knex')(require('./knexfile'))
var username = null
var privilegeLevel = null

const moment = require('moment')

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
		username = null;
		privilegeLevel = 0;
		return Promise.resolve()
	},
	insertManager({username, birthday, employment_date}) {
		return knex.schema.raw(`
			select * 
				from users
					where user=\"${username}\" limit 1`
		).then((value) => {
			if (value[0].length != 0) { 
				console.log("user to promote:", username, value[0][0].name);
				return knex('manageri').insert({
					userid : value[0][0].id,
					nume : value[0][0].name,
					data_nasterii : birthday,
					data_angajarii : employment_date
				});
			}
			else
				return Promise.reject(new Error('User name not found'));
		})
	},
	insertWaiter({manager_username, waiter_username, birthday, employment_date}) {
		return knex.schema.raw(`
			select manager.id
				from manageri manager, users user
					where user.user = \"${manager_username}\"
						and manager.userid = user.id limit 1`
		)
		.then((manager_value) => {
			if (manager_value[0].length != 0) {
				return knex.schema.raw(`
					select * 
						from users
							where user = \"${waiter_username}\" limit 1`
				)
				.then((waiter_value) => {
					if (waiter_value[0].length != 0) {
						console.log("user to enslave:", 
								waiter_username, waiter_value[0][0].name);
						return knex('ospatari').insert({
							userid : waiter_value[0][0].id,
							manager_id : manager_value[0][0].id,
							nume : waiter_value[0][0].name,
							data_nasterii : birthday,
							data_angajarii : employment_date
						});
					}
					else
						return Promise.reject(new Error('User name not found'));
				})
			}
			else
				return Promise.reject(new Error('Manager not found'));
		})
	},
	getWaiterList() {
		return knex.schema.raw(`
			select
				waiter.nume as name,
				waiter.data_nasterii as birthday,
				waiter.data_angajarii as employment_date,
				waiter_user.user as waiter_username,
				manager_user.user as manager_username
			from ospatari waiter
				join manageri manager on manager.id = waiter.manager_id
				join users waiter_user on waiter_user.id = waiter.userid
				join users manager_user on manager_user.id = manager.userid
		`)

		.then((value) => {
			var waiter_list = [];
			value[0].forEach((entry) => {
				entry.employment_date = 
						moment(entry.employment_date).format("DD-MM-YYYY");
				entry.birthday = 
						moment(entry.birthday).format("DD-MM-YYYY");
				waiter_list.push(entry);
				console.log(entry);
			});
			return Promise.resolve(waiter_list);
		})
	},
	getManagerList() {
		return knex.schema.raw(`
			select
				manager.nume as name,
				manager.data_nasterii as birthday,
				manager.data_angajarii as employment_date,
				manager_user.user as manager_username
			from manageri manager
				join users manager_user on manager_user.id = manager.userid
		`)

		.then((value) => {
			var manager_list = [];
			value[0].forEach((entry) => {
				entry.employment_date = 
						moment(entry.employment_date).format("DD-MM-YYYY");
				entry.birthday = 
						moment(entry.birthday).format("DD-MM-YYYY");
				manager_list.push(entry);
				console.log(entry);
			});
			return Promise.resolve(manager_list);
		})
	},
	removeManager({manager_username}) {
		return knex.schema.raw(`
			delete manager from manageri manager
				where manager.userid = 
					(select manager_user.id from users manager_user
						where manager_user.user = \"${manager_username}\")
		`)
	},
	removeWaiter({waiter_username}) {
		return knex.schema.raw(`
			delete waiter from ospatari waiter
				where waiter.userid = 
					(select waiter_user.id from users waiter_user
						where waiter_user.user = \"${waiter_username}\")
		`)
	}
}
