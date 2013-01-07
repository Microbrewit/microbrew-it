'use strict';
var http = require('http'),
	querystring = require('querystring'),
	config = require('../config'),
	mb = require('../ontology').mb,
	ts = require('../tripplestore'),

	createInsertString = function (options, callback) {
		console.log('====!!!! STARTING INSERT !!!!====');
		var insert = 'INSERT DATA {';
		if (!options.name && !options.uri) {
			callback(new Error('Name required'));
		} else {
			if (!options.uri) {
				insert += ' <http://www.microbrew.it/beer/' + encodeURIComponent(options.name) + '> rdf:type' + mb.beer;
				insert += '; ' + mb.name + '"' + options.name + '"';
				console.log('===== RECEIVED NO URI TO INSERT INTO =====');
			} else {
				insert += ' <' + options.uri + '> ';
				console.log('===== RECEIVED URI TO INSERT INTO =====');
			}

			insert += options.brewery ? mb.brewedBy + ' <http://www.microbrew.it/Brewery/' + encodeURIComponent(options.brewery) + '>' : '';
			insert += options.styles ?  mb.style + ' "' + options.styles + '";' : '';
			insert += options.abv ?  mb.abv + ' "' + options.abv + '";' : '';
			insert += options.origin ?  mb.origin + ' "' + options.origin + '";' : '';
			insert += options.image ?  mb.image + ' "' + options.image + '";' : '';
			insert += options.bottle ?  mb.bottle + ' "' + options.bottle + '";' : '';
			insert += options.label ?  mb.label + ' "' + options.label + '";' : '';
			insert += options.comment ?  mb.comment + ' "' + options.comment + '";' : '';
			insert += options.description ?  mb.description + '"' + options.description + '";' : '';
			insert += options.servingtype ?  mb.servingType + '"' + options.servingtype + '";' : '';
			insert += options.glasstype ?  mb.glassType + ' "' + options.glasstype + '";' : '';
			insert += options.ibu ? mb.ibu + ' "' + options.ibu + '";' : '';
			insert += options.aroma ? mb.aroma + ' "' + options.aroma + '";' : '';
			insert += options.appearance ?  mb.appearance + ' "' + options.appearance + '";' : '';
			insert += options.mouthfeel ?  mb.mouthfeel + ' "' + options.mouthfeel + '";' : '';
			insert += options.colour ? mb.colour + ' "' + options.colour + '";' : '';
			insert += options.barcode ? mb.barcode + ' "' + options.barcode + '";' : '';
			insert += options.ebc ? mb.ebc + '"' + options.ebc + '";' : '';
			insert += options.brewery ? '.  <http://www.microbrew.it/Brewery/' + encodeURIComponent(options.brewery) + '>' + mb.name + ' "' + options.brewery + '"' : '';
			insert +=  ' }';
			console.log("INSERT: " + insert);
			callback(null, encodeURIComponent(insert));
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

exports.ask = function (triple, callback) {
	var askQuery = 'ASK {' + triple + '}';
	ts.ask(askQuery, function (err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result);
		}
	});
};

exports.insert = function (beer, callback) {
	createInsertString(beer, function (err, result) {
		if (err) {
			callback(err);
		} else {
			options.path = config.ts.path.insert;
			var request = http.request(options, function (response) {
					response.on('end', function () {
						if (response.statusCode !== 204) {
							callback(new Error('Insertion was not accepted'));
						} else {
							callback(null, {'statusCode': response.statusCode, 'query' : result});
						}
					});
					response.on('data', function (data) {
					});

				});
			request.on('error', function (e) {
				callback(new Error(e.message));
			});
			request.end('update=' + result);
		}
	});
};

exports.select = function (beerName, callback) {
	var returnedJSON = '',
		request,
		select;
	select = 'SELECT * WHERE { ?uri ' + mb.name + ' "' + beerName + '" .';
	select += ' ?uri' + mb.name + ' ?name .';
	select += ' OPTIONAL { ?uri' + mb.style + ' ?style} . ';
	select += ' OPTIONAL { ?uri' + mb.abv  + '?abv} . ';
	select += ' OPTIONAL { ?uri' + mb.origin  + '?origin} . ';
	select += ' OPTIONAL { ?uri' + mb.bottle  + '?bottle} . ';
	select += ' OPTIONAL { ?uri' + mb.image  + '?image} . ';
	select += ' OPTIONAL { ?uri' + mb.label  + '?label} . ';
	select += ' OPTIONAL { ?uri' + mb.comment  + '?comment} . ';
	select += ' OPTIONAL { ?uri' + mb.description  + '?description} . ';
	select += ' OPTIONAL { ?uri' + mb.servingType  + '?servingType} . ';
	select += ' OPTIONAL { ?uri' + mb.glassType  + '?glassType} . ';
	select += ' OPTIONAL { ?uri' + mb.ibu  + '?ibu} . ';
	select += ' OPTIONAL { ?uri' + mb.aroma  + '?aroma} . ';
	select += ' OPTIONAL { ?uri' + mb.appearance  + '?appearance} . ';
	select += ' OPTIONAL { ?uri' + mb.mouthfeel  + '?mouthfeel} . ';
	select += ' OPTIONAL { ?uri' + mb.ebc  + '?ebc} . ';
	select += ' OPTIONAL { ?uri' + mb.colour  + '?colour} . ';
	select += ' OPTIONAL { ?uri' + mb.barcode  + '?barcode} . ';
	select += ' ?uri' + mb.brewedBy  + '?brewedBy. ';
	select += ' OPTIONAL { ?brewedBy' + mb.name  + '?breweryName} . ';
	select += '}';

	console.log(select);
	options.path = config.ts.path.query;
	options.headers.accept = 'application/sparql-results+json';
	request = http.request(options, function (response) {
		console.dir(response);
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			returnedJSON += chunk;
		});
		response.on('end', function () {
			var json = JSON.parse(returnedJSON);
			console.log(JSON.stringify(json)); // TODO: remove (used for bugfix)
			callback(null, json);
		});
	});
	request.on('error', function (e) {
		callback(new Error(e.message));
	});
	request.end('query=' + encodeURIComponent(select));
};

exports.findBrewery = function (breweryName, callback) {
	var returnedJSON,
	  request,
	  select;
	select = 'SELECT * WHERE {?breweryURI ' + mb.name + ' "' + breweryName + '" .';
	select += ' OPTIONAL { ?breweryURI ' + mb.name + ' ?name} . ';
	select += '}';

	console.log(select);
	options.path = config.ts.path.query;
	options.headers.accept = 'application/sparql-results+json';
	request = http.request(options, function (response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log(chunk);
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
	request.end('query=' + encodeURIComponent(select));
};
