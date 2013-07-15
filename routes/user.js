var url = require('url'),
user = require('../app/user'),
utils = require('../app/util');

var login = function (req, res) {
	var response = "";
	var params = url.parse(req.url, true).query;	
	if(!req.session.user) {
		if(params.username && params.password) {
			user.passwordCheck(
				{
					'username': params.username,
					'password': params.password
				},
				function (err, result) {
					if(err) {
						res.writeHead(401, {'Content-Type': 'application/json'});
						response = {'error': 'Unauthorized. Password and/or username is incorrect'};
					} else {
						console.log("Else: Set session and write header");
						req.session.user = params.username;
						response = {
							'message': 'User successfully logged in.',
							'user': result.user
							};
						res.writeHead(200, {'Content-Type': 'application/json'});
					}
					utils.formatJsonResponse(params, response, function (cbResponse) {
						res.end(cbResponse);
					});
				});
		} else {
			res.writeHead(400, {'Content-Type': 'application/json'});
			response = {'error': 'Bad Request. Username and/or password missing.'};
			utils.formatJsonResponse(params, response, function (cbResponse) {
				res.end(cbResponse);
			});
		}
	} else {
		res.writeHead(400, {'Content-Type': 'application/json'});
		response = {'error': 'Bad Request. A user is already logged in. Log out first.'};
		utils.formatJsonResponse(params, response, function (cbResponse) {
			res.end(cbResponse);
		});
	}

};

var logout = function (req, res) {
	var params = url.parse(req.url, true).query;
	var response = {};	
	if(req.session.user) {
		req.session.destroy();
		req.session = null;
		res.writeHead(200, {'Content-Type': 'application/json'});
		response = {'message': 'User successfully logged out.'};
	} else {
		res.writeHead(400, {'Content-Type': 'application/json'});
		response = {'error': 'No user to log out.'};
	}
	utils.formatJsonResponse(params, response, function (cbResponse) {
			res.end(cbResponse);
	});

};

var details = function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end("{'message': 'Here comes user info in time");
};

var addUser = function (req, res) {
	var params = url.parse(req.url, true).query;
	var response = {};	
	if(req.session.user) {
		res.writeHead(418, {'Content-Type': 'application/json'});
		response = {'error': 'Cannot register a new user while logged in.'};
		utils.formatJsonResponse(params, response, function (cbResponse) {
			res.end(cbResponse);
		});
	} else {
		if(params.username && params.email && params.brewery_name && params.password && params.settings) {
			console.log('success');
			var userData = {
				'username' : params.username,
				'email' : params.email,
				'password' : params.password,
				'breweryname' : params.brewery_name,
				'settings' : params.settings
			};
			user.setUser(userData, function (err, result) {
				res.writeHead(200, {'Content-Type': 'application/json'});
				if(err) {
					response = err;
				} else {
					req.session.user = result.username;
					reponse = {
						'message': 'User successfully created and logged in.',
						'user': result
					};
				}
				utils.formatJsonResponse(params, response, function (cbResponse) {
					res.end(cbResponse);
				});
			});
		} else {
			console.log('fail');
			res.writeHead(400, {'Content-Type': 'application/json'});
			response = {
				'statuscode' : "400",
				'error' : "POST parameters missing."
			};
			utils.formatJsonResponse(params, response, function (cbResponse) {
				res.end(cbResponse);
			});
		}
	}

};

var updateUser = function (req, res) {
	var params = url.parse(req.url, true).query;
	var response = {};
	if(req.session.user) {
		if(params.email && params.settings && params.password) {
			var userData = {
				'username': req.session.user,
				'email': params.email,
				'password': params.password,
				'settings': params.settings
			};

			user.updateUser(userData, function (err, result) {
				if(err) {
					res.writeHead(400, {'Content-Type': 'application/json'});
					response = err;
				} else {
					res.writeHead(200, {'Content-Type': 'application/json'});
					response = {
						'message': 'User succesfully updated.',
						'user': result
					};
				}
				utils.formatJsonResponse(params, response, function (cbResponse) {
					res.end(cbResponse);
				});
			});
		} else {
			res.writeHead(400, {'Content-Type': 'application/json'});
			response = {'error': 'One or more missing params.'};
			utils.formatJsonResponse(params, response, function (cbResponse) {
				res.end(cbResponse);
			});
		}

	} else {
		res.writeHead(400, {'Content-Type': 'application/json'});
		response = {'error': 'Log in to update user.'};
		utils.formatJsonResponse(params, response, function (cbResponse) {
			res.end(cbResponse);
		});
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