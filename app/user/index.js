var bcrypt = require('bcrypt'),
pg = require('pg'),
config = require('../config');


exports.setUser = function (userData, callback) {
	
	var client = new pg.Client(config.psql);
	client.connect();
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(userData.password, salt, function (err, hash) {
				if (err) {
					console.log("error in bcrypt");
				} else {
				 client.query('INSERT INTO users(username, password, email) values($1, $2, $3)', [userData.name, hash, userData.email], function (error, result) {
				 		if(error) {
				 			callback(error);
				 		} else {
				 			callback(null, result);
				 		}
				 });
				}
		});
	});

};