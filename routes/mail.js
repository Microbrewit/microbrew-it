var http = require('http'),
	url = require('url'),
	mysql = require('mysql'),
	config = require('./config'),
	connection = mysql.createConnection({
		'host'	: config.host,
		'user'	: config.user,
		'password' : config.password,
		'database' : config.database
	});

exports.mail = function (req, res) {
	connection.connect();
	var param = url.parse(req.url, true).query,
		name = param.name,
		email = param.email;
	console.log(connection);
	connection.query('INSERT INTO subscribers SET email =?, name=?', [email, name]);

	console.log('Name: ' + name + ' Email: ' + email);
	res.render('success', { title: 'Microbrewit' });
};