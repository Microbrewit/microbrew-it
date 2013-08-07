"use strict";
var http = require('http'),
	config = require('../config'),
	mb = require('../ontology').mb,
	util = require('../util'),
	opts = {
		'host': config.ts.host,
		'port': config.ts.port,
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		'method': 'POST'
	};
/**
*	Takes a SPARQL ASK query, and returns 'true' or 'false'.
**/
exports.ask = function (query, callback) {
	var options = util.beget(opts),
		data = '',
		request;
	options.headers.accept = 'text/boolean';
	options.path =  config.ts.path.query;
	request = http.request(options, function (response) {
		response.on('data', function (chunk) {
			data += chunk;
		});
		response.on('end', function () {
			if(data == "false") {
				data = false;
			} else if(data == "true") {
				data = true;
			}
			callback(null, data);
		});
	});
	request.on('error', function (e) {
		callback(new Error(e.message));
	});
	request.end('query=' + encodeURIComponent(query));
};

/**
*	Takes a SPARQL INSERT statement and attempts to insert it into the triple store.
*	Returns an object with the 204 statuscode, and the insertion query,
*	Or returns an Exception.
**/
exports.insert = function (query, callback) {
	var options = util.beget(opts),
		request;
	options.path = config.ts.path.insert;
	request = http.request(options, function (response) {
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
	request.end('update=' + encodeURIComponent(query));
};
/**
*	Takes a SPARQL SELECT query, and returns the result set as a JSON object
*	Throws an Exception if
there is something wrong with the connection
**/
exports.select = function (query, callback) {
	var options = util.beget(opts),
		returnedJSON = '',
		request;
	options.path = config.ts.path.query;
	options.headers.accept = 'application/sparql-results+json';
	request = http.request(options, function (response) {
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
