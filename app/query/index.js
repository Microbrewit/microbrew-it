'use strict';
var http = require('http'),
	querystring = require('querystring'),
	config = require('../config'),
	mb = require('../ontology').mb,
	ts = require('../triplestore'),

	breweryURI = function (breweryName) {
		var id = new Date().getTime() + '' + (Math.floor((Math.random()) * 100) + 100),
			uri = 'http://microbrew.it/brewery/' + encodeURIComponent(breweryName) + '/' + id;
		console.log(id);
		return uri;
	},

	createInsertString = function (options, callback) {
		var insert = 'INSERT DATA { ';
		if (!options.name && !options.uri) {
			callback(new Error('Name required'));
		} else {
			if (!options.breweryuri) {
				options.breweryuri = breweryURI(options.brewery);
				insert += options.brewery ? '<' + options.breweryuri + '> ' + mb.name + ' "' + options.brewery + '" ; rdf:type' + mb.brewery + '.' : '';
			}
			if (!options.uri) {
				insert += ' <' + options.breweryuri + '/' + encodeURIComponent(options.name) + '> rdf:type' + mb.beer;
				insert += '; ' + mb.name + '"' + options.name + '"';
			} else {
				insert += ' <' + options.uri + '> ';
			}

			insert += options.brewery ? ' ; ' + mb.brewedBy + ' <' + options.breweryuri + '>' : '';
			insert += options.styles ?  ' ; ' + mb.style + ' "' + options.styles + '"' : '';
			insert += options.abv ?  ' ; ' + mb.abv + ' "' + options.abv + '"' : '';
			insert += options.origin ?  ' ; ' + mb.origin + ' "' + options.origin + '"' : '';
			insert += options.image ?  ' ; ' + mb.image + ' "' + options.image + '"' : '';
			insert += options.bottle ?  ' ; ' + mb.bottle + ' "' + options.bottle + '"' : '';
			insert += options.label ?  ' ; ' + mb.label + ' "' + options.label + '"' : '';
			insert += options.comment ? ' ; ' +  mb.comment + ' "' + options.comment + '"' : '';
			insert += options.description ?  ' ; ' + mb.description + '"' + options.description + '"' : '';
			insert += options.servingtype ?  ' ; ' + mb.servingType + '"' + options.servingtype + '"' : '';
			insert += options.glasstype ?  ' ; ' + mb.glassType + ' "' + options.glasstype + '"' : '';
			insert += options.ibu ? ' ; ' + mb.ibu + ' "' + options.ibu + '"' : '';
			insert += options.aroma ? ' ; ' + mb.aroma + ' "' + options.aroma + '"' : '';
			insert += options.appearance ?  ' ; ' + mb.appearance + ' "' + options.appearance + '"' : '';
			insert += options.mouthfeel ?  ' ; ' + mb.mouthfeel + ' "' + options.mouthfeel + '"' : '';
			insert += options.colour ? ' ; ' + mb.colour + ' "' + options.colour + '"' : '';
			insert += options.barcode ? ' ; ' + mb.barcode + ' "' + options.barcode + '"' : '';
			insert += options.ebc ? ' ; ' + mb.ebc + '"' + options.ebc + '"' : '';
			//end
			insert +=  ' }';
			console.log('INSERT: ' + insert);
			callback(null, insert);
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

exports.beerName = function (beerName, callback) {
	var queryBeerName = 'SELECT ?name ?url ?brewery ?breweryName WHERE {';
	queryBeerName += '?url' + mb.name + '?name FILTER regex(?name, "' + beerName + '", "i") .';
	queryBeerName += '?url rdf:type' + mb.beer + '.';
	queryBeerName += ' ?url ' + mb.brewedBy + '?brewery .';
	queryBeerName += '?brewery' + mb.name + '?breweryName';
	queryBeerName += '}';
	//console.log('Query: ' + queryBeerName);
	ts.select(queryBeerName, function (err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result);
		}
	});
};

exports.breweryName = function (breweryName, callback) {
	var queryBreweryName = 'SELECT * WHERE {';
	queryBreweryName += '?url' + mb.name + '?name FILTER regex(?name, "' + breweryName + '", "i") .';
	queryBreweryName += '?url rdf:type' + mb.brewery + '.';
	queryBreweryName += '}';
	ts.select(queryBreweryName, function (err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result);
		}
	});
};

/**
*	Takes a triple, and returns boolean true if it exists in the triple store,
*	If not it returns boolean false.
*	Throws an exception if there is something wrong with the connection
**/
exports.ask = function (triple, callback) {
	var askQuery = 'ASK {' + triple + '}',
		response;
	ts.ask(askQuery, function (err, result) {
		if (err) {
			callback(err);
		} else {
			response = result.indexOf("true") !== -1;
			callback(null, response);
		}
	});
};
/**
*	Takes a Beer object and inserts it into the triple store
*	Returns an object with the status code and insertion statement
*	Throws an Exception if the insertion was not accepted.
**/
exports.insert = function (beer, callback) {
	createInsertString(beer, function (err, result) {
		if (err) {
			callback(err);
		} else {
			ts.insert(result, function (error, result) {
				if (error) {
					callback(error);
				} else {
					callback(null, result);
				}
			});
		}
	});
};

/**
*	Takes a beer name String
*	Returns a JSON object with the hits from the triple store.
**/
exports.select = function (beerName, callback) {
	var select;
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

	ts.select(select, function (err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result);
		}
	});

};

exports.findBrewery = function (breweryName, callback) {
	var returnedJSON,
	  request,
	  select;
	select = 'SELECT * WHERE {?breweryURI ' + mb.name + ' "' + breweryName + '" .';
	select += ' OPTIONAL { ?breweryURI ' + mb.name + ' ?name} . ';
	select += '}';
	ts.select(select, function (err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result);
		}
	});
};
