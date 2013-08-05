var url = require('url'),
user = require('../app/user'),
utils = require('../app/util');

var login = function (req, res) {
	var response = {},
		head = {
			'statuscode': 0,
			'contentType': {'Content-Type': 'application/json'}
		};
	var params = url.parse(req.url, true).query;
	if(typeof req.session !== "undefined" && !req.session.user && params.username && params.password) {
		user.passwordCheck(
			{
				'username': params.username,
				'password': params.password
			},
			function (err, result) {
				if(err) {
					head.statuscode = 401;
					response = {error: 'Unauthorized. Password and/or username is incorrect'};
				} else {
					console.log("Else: Set session and write header");
					req.session.user = params.username;
					response = {
						'message': 'User successfully logged in.',
						'user': result.user
						};
					head.statuscode = 200;
				}
			response = utils.formatJsonResponse(params, response);
			console.log(response);
			res.writeHead(head.statuscode, head.contentType);
			res.end(response);
			});
	} else {
		if(typeof req.session !== "undefined" && req.session.user) {
			head.statuscode = 400;
			response = {'error': 'Bad Request. A user is already logged in. Log out first.'};
			response = utils.formatJsonResponse(params, response);
		} else {
			head.statuscode = 400;
			response = {'error': 'Bad Request. Username and/or password missing.'};
			response = utils.formatJsonResponse(params, response);
		}
		res.writeHead(head.statuscode, head.contentType);
		res.end(response);
	}

};

var logout = function (req, res) {
	var params = url.parse(req.url, true).query;
	var response = {},
		head = {
			'statuscode': 0,
			'contentType': {'Content-Type': 'application/json'}
		};
	if(typeof req.session !== "undefined" && req.session.user) {
		req.session.destroy();
		req.session = null;
		head.statuscode = 200;
		response = {'message': 'User successfully logged out.'};
	} else {
		head.statuscode = 400;
		response = {'error': 'No user to log out.'};
	}
	response = utils.formatJsonResponse(params, response);
	res.writeHead(head.statuscode, head.contentType);
	res.end(response);
};

var details = function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end("{'message': 'Here comes user info in time");
};

var addUser = function (req, res) {
	var params = req.body
	var response = {},
		head = {
			'statuscode': 0,
			'contentType': {'Content-Type': 'application/json'}
		};
	console.log(req.body);
	if(typeof req.session === 'undefined' && params.username && params.email &&
		params.breweryname && params.password && params.settings) {
		var userData = {
			'username' : params.username,
			'email' : params.email,
			'password' : params.password,
			'breweryname' : params.brewery_name,
			'settings' : params.settings
		};
		user.setUser(userData, function (err, result) {
			if(err) {
				head.statuscode = 500;
				response = err;
			} else {
				req.session = {
					user: result.username
				}
				head.statuscode = 200;
				response = {
					'message': 'User successfully created and logged in.',
					'user': result
				};
			}
			response = utils.formatJsonResponse(params, response);
			console.log(response);
			res.writeHead(head.statuscode, head.contentType);
			res.end(response);
		});
	} else {
		if(typeof req.session !== "undefined" && req.session.user) {
			head.statuscode = 418;
			response = {'error': 'Cannot register a new user while logged in.'};
		} else {
			head.statuscode = 400;
			response = {
				'statuscode' : "400",
				'error' : "POST parameters missing."
			};
		}
		response = utils.formatJsonResponse(params, response);
		res.writeHead(head.statuscode, head.contentType);
		res.end(response);
	}
};

var updateUser = function (req, res) {
	var params = url.parse(req.url, true).query;
	var response = {},
		head = {
			'statuscode': 0,
			'contentType': {'Content-Type': 'application/json'}
		};

	if(typeof req.session !== "undefined" && req.session.user && params.email && params.settings && params.password) {
		var userData = {
			'username': req.session.user,
			'email': params.email,
			'password': params.password,
			'settings': params.settings
		};

		user.updateUser(userData, function (err, result) {
			if(err) {
				head.statuscode = 400;
				response = err;
			} else {
				head.statuscode = 200;
				response = {
					'message': 'User succesfully updated.',
					'user': result
				};
			}
			response = utils.formatJsonResponse(params, response);
			res.writeHead(head.statuscode, head.contentType);
			res.end(response);
		});
	} else {
		head.statuscode = 400;
		if(typeof req.session !== "undefined" && req.session.user) {
			response = {'error': 'One or more missing params.'};
		} else {
			response = {'error': 'Log in to update user.'};
		}
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
	'addUser': addUser,
	'updateUser': updateUser,
	'changePassword': changePassword
};
