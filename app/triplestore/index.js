var http = require('http'),
	config = require('../config'),
	mb = require('../ontology').mb,
	util = require('../util'),
	opts = {
		'host': config.ts.host,
		'port': config.ts.port,
		
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		'method': 'POST'
	};
exports.ask = function (query, callback) {
	var options = util.beget(opts);
	options.headers.accept = 'text/boolean';
	options.path =  config.ts.path.query;
	var data = '',
		request = http.request(options, function (response) {
				response.on('data', function (chunk) {
					data += chunk;

				});
				response.on('end', function () {
					callback(null, data);
				});
		});
	request.on('error', function (e) {
		callback(new Error(e.message));
	});
	request.end('query=' + encodeURIComponent(query));
};

exports.insert = function (query, callback) {
	var options = util.beget(opts);
	options.path = config.ts.path.insert;

	var request = http.request(options, function (response) {
			response.on('end', function () {
				if (response.statusCode !== 204) {
					callback(new Error('Insertion was not accepted (' + response.statusCode + ')'));
				} else {
					callback(null, {'statusCode': response.statusCode, 'query' : query});
				}
			});
			response.on('data', function (data) {
			});

		});

	request.on('error', function (e) {
		callback(new Error(e.message));
	});
	console.log('update=' + encodeURIComponent(query));
	request.end('update=' + encodeURIComponent(query));
};

exports.select = function (query, callback) {
	var options = util.beget(opts),
		returnedJSON = '';
	options.path = config.ts.path.query;
	options.headers.accept = 'application/sparql-results+json';
	
	var request = http.request(options, function (response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			returnedJSON += chunk;
		});
		response.on('end', function () {
			var json = JSON.parse(returnedJSON);
			callback(null, json);
		});
	});
	request.on('error', function (e) {
		callback(new Error(e.message));
	});
	request.end('query=' + encodeURIComponent(query));
};
