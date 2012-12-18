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
	
exports.save = function (options, callback) {
	connection.connect();
	connection.query('INSERT INTO subscribers SET email =?, name=?', [options.email, options.name]);
	connection.close();
};