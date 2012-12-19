'use strict';
var http = require('http'),
	querystring = require('querystring'),
	config = require('../config'),
	createInsertString = function (options, callback) {
		var prefixes = 'PREFIX mb:<http://www.microbrew.it/Beer/>',
			insert = 'INSERT DATA { ';
		if (!options.name) {
			callback(new Error('Name required'));
		} else {
			insert += 'mb:' + encodeURIComponent(options.name) + ' rdf:type mb:Beer';
			insert += '; mb:name "' + options.name + '"';
			insert += options.brewery ? ' ; mb:brewedBy <http://ontology.microbrew.it/Brewery/' + encodeURIComponent(options.brewery) + '>' : '';
			insert += options.styles ? '; mb:hasStyle "' + options.styles + '"' : '';
			insert += options.abv ? '; mb:abv "' + options.abv + '"' : '';
			insert += options.origin ? '; mb:origin "' + options.origin + '"' : '';
			insert += options.image ? '; mb:image "' + options.image + '"' : '';
			insert += options.bottle ? '; mb:bottle "' + options.bottle + '"' : '';
			insert += options.label ? '; mb:labe ":' + options.label + '"' : '';
			insert += options.comment ? '; mb:comment "' + options.comment + '"' : '';
			insert += options.description ? '; mb:description "' + options.description + '"' : '';
			insert += options.servingtype ? '; mb:servingType "' + options.servingtype + '"' : '';
			insert += options.glasstype ? '; mb:glassType "' + options.glasstype + '"' : '';
			insert += options.ibu ? '; mb:ibu "' + options.ibu + '"' : '';
			insert += options.aroma ? '; mb:aroma "' + options.aroma + '"' : '';
			insert += options.appearance ? '; mb:appearance "' + options.appearance + '"' : '';
			insert += options.mouthfeel ? '; mb:mouthfeel "' + options.mouthfeel + '"' : '';
			insert += options.colour ? '; mb:colour "' + options.colour + '"' : '';
			insert += options.barcode ? '; mb:barcode "' + options.barcode + '"' : '';
			insert +=  '}';
			callback(null, encodeURIComponent(prefixes + insert));
		}
	},
	options = {
		'host': config.ts.host,
		'port': config.ts.port,
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		'method': 'POST'
	};


exports.insert = function (beer, callback) {
	createInsertString(beer, function (err, result) {
		options.path = config.ts.path.insert + result;
		var request = http.request(options, function (response) {
				callback(null, response);
			});
		request.on('error', function (e) {
			callback(new Error(e.message));
		});
		request.end();
	});
};

exports.select = function (beerURI, callback) {
	var prefix = 'PREFIX foaf: <PREFIX mb:<http://www.microbrew.it/Beer/> ',
		select = encodeURIComponent('SELECT ?b  WHERE {' + beerURI + ' ?a ?b }'),
		returnedJSON = '',
		request;

	options.path = config.ts.path.query + encodeURIComponent(prefix) + select;
	request = http.request(options, function (response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			returnedJSON += chunk;
		});
		response.on('end', function () {
			var json = JSON.parse(returnedJSON);
			callback(null, {title: 'Query Results', BeerJSON: json });
		});
	});
	request.on('error', function (e) {
		callback(new Error(e.message));
	});
	request.end();
};
