'use strict';
var mb = require('../app/ontology').mb,
    url = require('url'),
    utils = require('../app/util'),
    beersRoute = require('./beer.js'),
    usersRoute = require('./users.js'),
    breweriesRoute = require('./brewery.js'),
    yeastsRoute = require('./yeasts.js'),
    hopsRoute = require('./hops.js'),
    fermentablesRoute = require('./fermentables.js'),
    othersRoute = require('./others.js'),
    origin = require('../app/origin');
/*
 * GET home page.
 */

var index = function (req, res) {
    console.log(JSON.stringify(req.session));
    res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end('{"message" : "Hello world this is Microbrew.it api : )"}');
};

var origins = function (req, res) {
    console.log(JSON.stringify(req.session));
	origin.getOrigins( function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
		var	response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var suppliers = function (req, res) {
    console.log(JSON.stringify(req.session));
	origin.getSuppliers( function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
		var	response = utils.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

exports = module.exports = {
    'index': index,
    'beers': beersRoute,
    'users': usersRoute,
    'breweries' : breweriesRoute,
    'yeasts': yeastsRoute,
    'hops': hopsRoute,
    'fermentables': fermentablesRoute,
    'others': othersRoute,
    'origins': origins,
    'suppliers': suppliers,
};
