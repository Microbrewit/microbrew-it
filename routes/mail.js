'use strict';
var http = require('http'),
	url = require('url'),
	mysql = require('mysql'),
	connection = mysql.createConnection({
		host	: 'geekbeer.thunemedia.no:3306',
		user	: 'microbrewit',
		password : 'Trippel Dubbel IPA Pils',
		database : 'microbrewit'
	});

exports.mail = function (req, res) {
	connection.connect();
	var param = url.parse(req.url, true).query,
		name = param.name,
		email = param.email;
	connection.query('INSERT INTO subscribers SET email =?, name=?', [email, name]);
	console.log('Name: ' + name + ' Email: ' + email);
	res.render('success', { title: 'Microbrewit' });
};
