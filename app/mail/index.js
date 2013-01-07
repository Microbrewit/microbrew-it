var http = require('http'),
	url = require('url'),
	pg = require('pg'),
	config = require('../config'),
	postgresql = config.postgresql,
	connectionString = "tcp://"+postgresql.user+":"+postgresql.password+"@"+
		postgresql.host+":"+postgresql.port+"/"+postgresql.db;

exports.save = function (options, callback) {

	pg.connect(connectionString, function(client) {
		client.query('INSERT INTO subscribers VALUES email=$1, name=$2', [options.email, options.name]);
	});
};
