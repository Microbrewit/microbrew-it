var bcrypt = require('bcrypt'),
pg = require('pg'),
config = require('../config');

// Key value object for postgres error codes with appropriate error messages
var errorCodes = {
	23505 : 'User with provided values already exist in database'
};


exports.setUser = function (userData, callback) {
	var client = new pg.Client(config.postgresql);
	client.connect();
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(userData.password, salt, function (err, hash) {
			if (err) {
				console.log("error in bcrypt");
				return callback(err);
			} else {
				client.query('INSERT INTO users(username, password, email) values($1, $2, $3) RETURNING *',
					[userData.username, hash, userData.email],
					function (error, result) {
					if(error) {
						callback({
							'error' : errorCodes[error.code],
							'code' : error.code
						});
					} else {

						console.log("Result: " + JSON.stringify(result));
						callback(null, {
							'username' : result.rows[0].username,
							'email' : result.rows[0].email,
							'breweryname' : userData.breweryname
						});
					}
				});
			}
		});
	});

};

exports.passwordCheck = function (userData, callback) {
	var client = new pg.Client(config.postgresql);
	client.connect();
	client.query('SELECT password FROM users WHERE email = $1', [userData.email], function (err, res) {
		if(err) {
			callback(err);
		} else {
			if(res.rows.length > 0) {
				var hash = res.rows[0].password;

				bcrypt.compare(userData.password, hash, function (error, result) {
					if(error) {
						callback(error);
					} else {
						console.log(result);
					}
				});
			} else {
				callback(null, false);
			}
		}

	});
};