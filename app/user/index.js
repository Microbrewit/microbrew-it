var bcrypt = require('bcrypt'),
pg = require('pg'),
config = require('../config');


exports.setUser = function (userData, callback) {
	var con = config.postgresql,
	client = new pg.Client(con);
	client.connect();
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(userData.password, salt, function (err, hash) {
				if (err) {
					console.log("error in bcrypt");
				} else {
				 client.query('INSERT INTO public.users(username, password, email) values($1, $2, $3)', [userData.name, hash, userData.email]);
				}
		});
	});

};