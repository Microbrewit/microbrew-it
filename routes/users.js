var url = require('url'),
user = require('../app/user'),
utils = require('../app/util');

/*
 * Function maps to /users/login
 * Request type: POST
 * Request params: id, password
 */
var login = function (req, res) {
	var response = {},
		head = {
			'statuscode': 0,
			'contentType': {'Content-Type': 'application/json'}
		};
	var params = req.body;
	if(typeof req.session !== 'undefined' && req.session.user && req.session.user.length > 0) {
		console.log('User is logged in!');
			head.statuscode = 400;
			response = {
				error: {
					message: 'Bad Request. A user is already logged in. Log out first.',
					code: 0
				},
				meta: {
					returned: 0
				}
			};
			response = utils.formatJsonResponse(params, response);
			res.writeHead(head.statuscode, head.contentType);
			res.end(response);
	} else { // User not logged in
		if(typeof req.session !== null && params.id && params.password) {
			user.passwordCheck(
				{
					username: params.id,
					password: params.password
				},
			function (err, result) {
				if(err) {
					head.statuscode = 401;
					response = {
						error: {
							message: 'Unauthorized. Password and/or id (username) is incorrect',
							code: 0
						},
						meta: {
							returned: 0
						}
					};
				} else {
					console.log(params);
					req.session.user = params.id;
					req.session.userObj = result.user;
					console.log(result);
					response = {
						meta: {
							message: 'User successfully logged in.',
							returned: 1
						},
						'users': [result.user]
					};
					head.statuscode = 200;
					console.log(req.session);
				}
				response = utils.formatJsonResponse(params, response);
				res.header('Access-Control-Allow-Origin', '*');
				res.writeHead(head.statuscode, head.contentType);
				res.end(response);

			});
		} else { // Missing params
			head.statuscode = 400;
			response = {
				error: {
					message: 'Bad Request. id (username) and/or password missing.'
				},
				meta: {
					returned: 0
				}
			};
			response = utils.formatJsonResponse(params, response);
			res.writeHead(head.statuscode, head.contentType);
			res.end(response);
		}
	}
};

/*
 * Function map to /user/logout
 * Request type: POST
 * No params
 */
var logout = function (req, res) {
	var response = {},
		head = {
			'statuscode': 0,
			'contentType': {'Content-Type': 'application/json'}
		};
	console.log(JSON.stringify(req.session));
	if(typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined' && req.session.user) {
		req.session.destroy();
		req.session = null;
		head.statuscode = 200;
		response = {
			meta: {
				message: 'User successfully logged out.'
			}
		};
	} else {
		head.statuscode = 400;
		response = {
			error: {
				message: 'No user to log out.',
				code: 'U104'
			}
		};
	}
	response = utils.formatJsonResponse({}, response);
	res.writeHead(head.statuscode, head.contentType);
	res.end(response);
};

var check = function (req, res) {
	var response = {},
		head = {
			'statuscode': 0,
			'contentType': {'Content-Type': 'application/json'}
		};
	var params = req.body;
		if(typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined' && req.session.user) {
			head.statuscode = 200;
							response = {
								meta: {
									message: 'Here is the user information',
									returned: 1
								},
								users: [req.session.userObj]
							};
			} else {
				head.statuscode = 400;
				response = {
					error: {
						message: 'No users logged in.',
						code: 'U105'
					}
				};
			}
			response = utils.formatJsonResponse(req.query, response);
			res.header('Access-Control-Allow-Origin', '*');
			res.writeHead(head.statuscode, head.contentType);
			res.end(response);
};

/*
 * Maps to: /users/dtails/:ids
 *
 */
var details = function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end("{'message': 'Here comes user info in time");
};

/*
 * Maps to: /users
 * Request type: POST
 * Params: id, email, password, breweryname, settings
 */
var addUpdateUser = function (req, res) {
	var params = req.body;
	var response = {},
		head = {
			'statuscode': 0,
			'contentType': {'Content-Type': 'application/json'}
		};
	//console.log(JSON.stringify(req.body));

	if(params.username && params.email &&
		params.breweryname && params.password && params.settings) {

		var userData = {
			'username' : params.username,
			'email' : params.email,
			'password' : params.password,
			'breweryname' : params.breweryname,
			'settings' : params.settings
		};

		var addUser = function (userData, callback) {
			if(typeof req.session !== 'undefined' && req.session.user) { // User is logged in
				callback({
						message: "Can not register new user while logged in.",
						code: 0
					});
			} else { // User is not logged in
				console.log(userData);
				user.setUser(userData, callback);
			}
		};

		var updateUser = function (userData, callback) {
			if(typeof req.session !== 'undefined' && req.session.user === userData.username) { // Logged in and correct username
				user.updateUser(userData, callback);
			} else { // Not logged in
				callback({
						message: 'Cannot update user while not logged in',
						code: 0
					});
			}

		};

		user.userExistsCheck(params.username, function (existsErr, existsRes) {
			if(existsErr) { // Error occured
				head.statuscode = 500;
				response = {
					error: {
						message: 'Server error.',
						code: 0
					},
					meta: {
						returned: 0
					}
				};
				response = utils.formatJsonResponse(params, response);
				res.writeHead(head.statuscode, head.contentType);
				res.end(response);
			} else {
				console.log("Exists? : " + existsRes);
				if(existsRes) { // User exists
					updateUser(userData, function (updateErr, updateRes) {
						if(updateErr) { // Could not update the user
							head.statuscode = 500;
							response = {
								error: updateErr,
								meta: {
									returned: 0
								}
							};
						} else { // User was succesfully updated
							head.statuscode = 200;
							response = {
								meta: {
									message: 'The user was successfully updated.',
									returned: 1
								},
								users: [updateRes]
							};
						}
						response = utils.formatJsonResponse(params, response);
						res.writeHead(head.statuscode);
						res.end(response);
					});
				} else {
					addUser(userData, function (addErr, addRes) {
						console.log(JSON.stringify(addErr));
						if(addErr) {
							head.statuscode = 500;
							response = {
								error: addErr,
								meta: {
									returned: 0
								}
							};
						} else { // User was succesfully inserted
							head.statuscode = 200;
							response = {
								meta: {
									message: 'The user was successfully added.',
									returned: 1
								},
								users: [addRes]
							};
						}
						response = utils.formatJsonResponse(params, response);
						res.writeHead(head.statuscode);
						res.end(response);
					});
				}
			}
		});
	} else { // Parameters missing!
		head.statuscode = 400;
		response = {
			error: {
				message: 'POST parameters missing.',
				code: 0
			},
			meta: {
				returned: 0
			}
		};
		response = utils.formatJsonResponse(params, response);
		res.writeHead(head.statuscode, head.contentType);
		res.end(response);
	}
};

var changePassword = function (req, res) {

};

exports = module.exports = {
	'login': login,
	'logout': logout,
	'details': details,
	'addUpdateUser': addUpdateUser,
	'changePassword': changePassword,
	'check': check,
};
