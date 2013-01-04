'use strict';
var http = require('http'),
	querystring = require('querystring'),
	config = require('../config'),
	mb = require('../ontology').mb,
	createInsertString = function (options, callback) {
		var insert = 'INSERT DATA { ';
		if (!options.name) {
			callback(new Error('Name required'));
		} else {
			insert += '<http://www.microbrew.it/beer/' + encodeURIComponent(options.name) + '> rdf:type' + mb.beer;
			insert += '; ' + mb.name + '"' + options.name + '"';
			insert += options.brewery ? '; ' + mb.brewedBy + ' <http://www.microbrew.it/Brewery/' + encodeURIComponent(options.brewery) + '>' : '';
			insert += options.styles ? ';  ' + mb.style + ' "' + options.styles + '"' : '';
			insert += options.abv ? ';  ' + mb.abv + ' "' + options.abv + '"' : '';
			insert += options.origin ? ';  ' + mb.origin + ' "' + options.origin + '"' : '';
			insert += options.image ? ';  ' + mb.image + ' "' + options.image + '"' : '';
			insert += options.bottle ? ';  ' + mb.bottle + ' "' + options.bottle + '"' : '';
			insert += options.label ? ';  ' + mb.label + ' "' + options.label + '"' : '';
			insert += options.comment ? ';  ' + mb.comment + ' "' + options.comment + '"' : '';
			insert += options.description ? ';  ' + mb.description + '"' + options.description + '"' : '';
			insert += options.servingtype ? ';  ' + mb.servingType + '"' + options.servingtype + '"' : '';
			insert += options.glasstype ? ';  ' + mb.glassType + ' "' + options.glasstype + '"' : '';
			insert += options.ibu ? ';  ' + mb.ebu + ' "' + options.ibu + '"' : '';
			insert += options.aroma ? ';  ' + mb.aroma + ' "' + options.aroma + '"' : '';
			insert += options.appearance ? ';  ' + mb.appearance + ' "' + options.appearance + '"' : '';
			insert += options.mouthfeel ? ';  ' + mb.mouthfeel + ' "' + options.mouthfeel + '"' : '';
			insert += options.colour ? '; ' + mb.colour + ' "' + options.colour + '"' : '';
			insert += options.barcode ? '; ' + mb.barcode + ' "' + options.barcode + '"' : '';
			insert += options.ebc ? '; ' + mb.ebu + '"' + options.ebu + '"' : '';
			insert +=  ' }';
			console.log(insert);
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


exports.insert = function (beer, callback) {
	createInsertString(beer, function (err, result) {
		options.path = config.ts.path.insert;
		var request = http.request(options, function (response) {
				callback(null, response);
			});
		request.on('error', function (e) {
			callback(new Error(e.message));
		});
		request.end('update=' + result);
	});
};

exports.select = function (beerURI, callback) {
	var returnedJSON = '',
		request,
		select;
	select = 'SELECT *  WHERE {' + beerURI + mb.name + '?name .';
	select += ' OPTIONAL { ' + beerURI + mb.style + ' ?style} .';
	select += ' OPTIONAL { ' + beerURI + mb.abv  + '?abv} .';
	select += ' OPTIONAL { ' + beerURI + mb.origin  + '?origin} . ';
	select += ' OPTIONAL { ' + beerURI + mb.bottle  + '?bottle} . ';
	select += ' OPTIONAL { ' + beerURI + mb.image  + '?image} . ';
	select += ' OPTIONAL { ' + beerURI + mb.label  + '?label} . ';
	select += ' OPTIONAL { ' + beerURI + mb.comment  + '?commen} . ';
	select += ' OPTIONAL { ' + beerURI + mb.description  + '?description} . ';
	select += ' OPTIONAL { ' + beerURI + mb.servingType  + '?servingType} . ';
	select += ' OPTIONAL { ' + beerURI + mb.glassType  + '?glassType} . ';
	select += ' OPTIONAL { ' + beerURI + mb.ebu  + '?ebu} . ';
	select += ' OPTIONAL { ' + beerURI + mb.aroma  + '?aroma} . ';
	select += ' OPTIONAL { ' + beerURI + mb.appearance  + '?appearance} . ';
	select += ' OPTIONAL { ' + beerURI + mb.mouthfeel  + '?mouthfeel} . ';
	select += ' OPTIONAL { ' + beerURI + mb.ebc  + '?ebc} . ';
	select += ' OPTIONAL { ' + beerURI + mb.colour  + '?colour} . ';
	select += ' OPTIONAL { ' + beerURI + mb.barcode  + '?barcode} . ';
	select += ' OPTIONAL { ' + beerURI + mb.brewedBy  + '?brewedBy} . ';
	select += '}';

	options.path = config.ts.path.query;
	options.headers.accept = 'application/sparql-results+json';
	request = http.request(options, function (response) {
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
