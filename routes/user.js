var url = require('url'),
user = require('../app/user');

var login = function () {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end("{'message': 'Placeholder. Here comes user logins info'}");
};

var logout = function () {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end("{'message': 'Placeholder. Here comes user logout infos'}");
};

var details = function () {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end("{'message': 'Here comes user info in time");
};

var addUser = function (req, res) {
	var param = url.parse(req.url, true).query;
	if(param.username && param.email && param.brewery_name && param.password) {
		console.log('success');
		var userData = {
			'username' : param.username,
			'email' : param.email,
			'password' : param.password,
			'breweryname' : param.brewery_name
		};
		user.setUser(userData, function (err, result) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			if(err) {
				res.end(JSON.stringify(err));
			} else {
				res.end(JSON.stringify(result));
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

};


exports = module.exports = {
	'login' : login,
	'logout' : logout,
	'details' : details,
	'addUser' : addUser
};