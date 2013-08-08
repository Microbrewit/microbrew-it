var url = require('url'),
utils = require('../app/util'),
mock = require('../app/mock'),
ingredients = require('../app/ingredients');

var fermentables = function (req, res) {
	ingredients.fermentables.getFermentables( function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var fermentable = function (req, res) {
	var ferm = req.params.fermentable;
	ingredients.fermentables.getFermentable(ferm, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var hops = function (req, res) {
	ingredients.hops.getHops( function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var hop = function (req, res) {
	var hop = req.params.hop;
	console.log(hop);
	ingredients.hops.getHop(hop, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var updateHops = function (req, res) {
	var hop = {	'name': req.body.name,
				'aa': req.body.aa,
				'origin': req.body.origin,
				'flavor': req.body.flavor
				};
	ingredients.hops.updateHop(hop, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var others = function (req, res) {
	ingredients.others.getOthers( function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

exports = module.exports = {
	'fermentables': fermentables,
	'fermentable': fermentable,
	'hops': hops,
	'hop': hop,
	'updateHops' : updateHops,
	'others': others
};
