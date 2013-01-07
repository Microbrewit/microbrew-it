var http = require('http'),
	config = require('../config'),
	mb = require('../ontology').mb;
exports.ask = function (query, callback) {
	var options = {
		'host': config.ts.host,
		'port': config.ts.port,
		'path': config.ts.path.query,
		
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded',
			'accept' : 'text/boolean'
		},
		'method': 'POST'
	},
	data = '',
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