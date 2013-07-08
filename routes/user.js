var url = require('url'),
user = require('../app/user');

var login = function () {

};

var logout = function () {

};

var userDetails = function () {

};

var addUser = function (req, res) {
	var param = url.parse(req.url, true).query;
	if(param.username && param.email && param.brewery_name && param.password) {
		console.log('success');
		var userData = {
			'username' : param.username,
			'email' : param.email,
			'password' : param.password
		};
		user.setUser(userData, function (err, res) {
			console.log(err);
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
			'statuscode' : "200",
			'message' : "User successfully created"
			}));
		});


	} else {
		console.log('fail');
		res.writeHead(400, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({
			'statuscode' : "400",
			'error' : "POST parameters missing."
		}));
	}

};


exports = module.exports = {
	'login' : login,
	'logout' : logout,
	'userDetails' : userDetails,
	'addUser' : addUser
};