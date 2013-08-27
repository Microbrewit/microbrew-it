(function(){
  'use strict';

var bcrypt = require('bcrypt'),
    pg = require('pg'),
	async = require('async'),
	mb = require('../ontology').mb,
	prefix = require('../ontology').prefix,
	ts = require('../triplestore'),
	util = require('../util'),
	config = require('../config');

// Key value object for postgres error codes with appropriate error messages
var errorCodes = {
	23505: 'User with provided values already exist in database',
	42601: 'Microbrewit-backend messed up. Sorry. :('
};

var setUser = function (userData, callback) {
	var storedUserData;
	async.series({
		postgres: function(callback) {
			var client = new pg.Client(config.postgresql);
			client.connect();
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(userData.password, salt, function (err, hash) {
					if (err) {
						console.log('error in bcrypt');
						return callback(err);
					} else {
						client.query('INSERT INTO users(username, password, email, settings) values($1, $2, $3, $4) RETURNING *',
							[userData.username, hash, userData.email, JSON.stringify(userData.settings)],
							function (error, result) {
							if(error) {
								callback({
									'error' : errorCodes[error.code],
									'code' : error.code
								});
							} else {
								storedUserData = [{
									'id': result.rows[0].username,
									'href': mb.userURI + result.rows[0].username,
									'username': result.rows[0].username,
									'email': result.rows[0].email,
									'settings': JSON.parse(result.rows[0].settings),
									'breweryname': userData.breweryname
								}];
								callback();
							}
						});
					}
				});
			});
		},
		triplestore: function (callback) {
			var unixID = util.createID();
			console.log(unixID);
			var insert = ' INSERT DATA { GRAPH  mbu:' + storedUserData[0].id + ' {';
			insert += ' mbu:' + storedUserData[0].id + ' a mb:User, owl:NamedIndividual, foaf:Person ; ';
			insert += ' mb:hasID "' + unixID +'" ; mb:hasEmail  "' + storedUserData[0].email + '" ; ';
			insert += ' mb:userName "' + storedUserData[0].id + '" ;';
			insert += ' mb:partOfBrewery mbb:' + encodeURIComponent(storedUserData[0].breweryname) + ' .' ;
			insert += ' }';
			insert += ' GRAPH mbb:' + encodeURIComponent(storedUserData[0].breweryname) + ' { ';
			insert += ' mbb:' + encodeURIComponent(storedUserData[0].breweryname) + ' a mb:Brewery, owl:NamedIndividual ; ';
			insert += ' rdfs:label "' + storedUserData[0].breweryname + '" }';
			insert += ' }';
			console.log(prefix + insert);
			ts.insert(prefix + insert, function (error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		}
	}, function(error,result) {
		if(error) {
			callback(error);
		} else {
			callback(null,storedUserData);
		}
	});
};

var updateUser = function (userData, callback) {
	var client = new pg.Client(config.postgresql);
	client.connect();
	var update = function (err, res) {
		if(err) {
			callback(err);
		} else {
			if(userData.email && userData.email.length > 6 && userData.settings) {
				client.query('UPDATE users SET email = $1, settings = $2 WHERE username = $3 RETURNING *',
					[userData.email, userData.settings, userData.username],
					function (error, result) {
						if(error) {
							callback({
								'error' : errorCodes[error.code],
								'code' : error.code
							});
						} else {
							callback(null, {
								id: result.rows[0].id,
								href: config.hostname + '/users/' + result.rows[0].username,
								username: result.rows[0].username,
								email: result.rows[0].email,
								settings: result.rows[0].settings,
								breweryname : userData.breweryname
							});
						}
					}
				); // End of client.query
			} else { // Else for if userdata
				callback({'error': 'Missing or invalid fields/values.'});
			}
		}
	};
	// Send named function update as callback to passwordcheck
	passwordCheck(userData, update);

};


var passwordCheck = function (userData, callback) {
	var client = new pg.Client(config.postgresql);
	client.connect();
	client.query('SELECT * FROM users WHERE username = $1', [userData.username], function (err, res) {
		if(err) {
			callback(err);
		} else {
			if(res.rows.length > 0) {
				var hash = res.rows[0].password;
				bcrypt.compare(userData.password, hash, function (error, result) {
					if(error) {
						callback(error);
					} else {
						callback(false, {
							'user': {
								id: res.rows[0].username,
								href: config.hostname + '/users/' + res.rows[0].username,
								username: res.rows[0].username,
								email: res.rows[0].email,
								settings: res.rows[0].settings
							}
						});
					}
				});
			} else {
				callback(null, false);
			}
		}

	});
};

var userExistsCheck = function (userId, callback) {
	var client = new pg.Client(config.postgresql);
	client.connect();
	client.query('SELECT * FROM users WHERE username = $1', [userId], function (err, res) {
		if (err) {
			callback(err);
		} else {
			if(res.rows.length === 1) {
				callback(false, true);
			} else {
				callback(false, false);
			}
		}
	});
};


exports = module.exports = {
	'setUser': setUser,
	'updateUser': updateUser,
	'passwordCheck': passwordCheck,
	'userExistsCheck': userExistsCheck
};
})();
