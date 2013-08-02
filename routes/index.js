'use strict';
var mb = require('../app/ontology').mb,
	url = require('url'),
	beerRoute = require('./beer.js'),
 	userRoute = require('./user.js'),
 	breweryRoute = require('./brewery.js'),
 	ingredientsRoute = require('./ingredients.js');



/*
 * GET home page.
 */

var index = function (req, res) {
	res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end('{"message" : "Hello world this is Microbrew.it api : )"}');
};

exports = module.exports = {
	'index': index,
	'beer': beerRoute,
	'user': userRoute,
	'brewery' : breweryRoute,
	'ingredients': ingredientsRoute
};
