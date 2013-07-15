var url = require('url'),
user = require('../app/user');

var login = function (req, res) {
	console.log(JSON.stringify(req.session));
	if(!req.session.user) {
		var param = url.parse(req.url, true).query;
		if(param.username && param.password) {
			user.passwordCheck(
				{
					'username': param.username,
					'password': param.password
				},
				function (err, result) {
					if(err) {
						res.writeHead(401, {'Content-Type': 'application/json'});
						res.end("{'error': 'Unauthorized. Password and/or username is incorrect'}");
					} else {
						req.session.user = param.username;
						response = {
							'message': 'User successfully logged in.',
							'user': result.user
							};
						res.writeHead(200, {'Content-Type': 'application/json'});
						res.end(JSON.stringify(response));
					}
				}
			);
		} else {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end("{'error': 'Bad Request. Username and/or password missing.'}");
		}
	} else {
		res.writeHead(400, {'Content-Type': 'application/json'});
		res.end("{'error': 'Bad Request. A user is already logged in. Log out first.'}");
	}

};

var logout = function (req, res) {
	if(req.session.user) {
		req.session.destroy();
		req.session = null;
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end("{'message': 'User successfully logged out.'}");
	} else {
		res.writeHead(400, {'Content-Type': 'application/json'});
		res.end("{'error': 'No user to log out.'}");
	}

};

var details = function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end("{'message': 'Here comes user info in time");
};

var addUser = function (req, res) {
	if(req.session.user) {
		res.writeHead(418, {'Content-Type': 'application/json'});
		res.end("{'error': 'Cannot register a new user while logged in.'}");
	} else {
		var param = url.parse(req.url, true).query;
		if(param.username && param.email && param.brewery_name && param.password && param.settings) {
			console.log('success');
			var userData = {
				'username' : param.username,
				'email' : param.email,
				'password' : param.password,
				'breweryname' : param.brewery_name,
				'settings' : param.settings
			};
			user.setUser(userData, function (err, result) {
				res.writeHead(200, {'Content-Type': 'application/json'});
				if(err) {
					res.end(JSON.stringify(err));
				} else {
					req.session.user = result.username;
					res.end(JSON.stringify(
					{
						'message': 'User successfully created and logged in.',
						'user': result
					}));
				}
			});
		} else {
			console.log('fail');
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				'statuscode' : "400",
				'error' : "POST parameters missing."
			}));
		}
	}

};

var updateUser = function (req, res) {
	if(req.session.user) {
		var param = url.parse(req.url, true).query;
		if(param.email && param.settings && param.password) {
			var userData = {
				'username': req.session.user,
				'email': param.email,
				'password': param.password,
				'settings': param.settings
			};

			user.updateUser(userData, function (err, result) {
				if(err) {
					res.writeHead(400, {'Content-Type': 'application/json'});
					res.end(JSON.stringify(err));
				} else {
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						'message': 'User succesfully updated.',
						'user': result
					}));
				}
			});
		} else {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({'error': 'One or more missing params.'}));
		}
	} else {
		res.writeHead(400, {'Content-Type': 'application/json'});
		res.end("{'error': 'Log in to update user.'}");
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