var url = require('url'),
utils = require('../app/util'),
mock = require('../app/mock'),
ingredients = require('../app/ingredients');

var fermentables = function (req, res) {
	ingredients.getFermentables( function (error, result) {
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
	ingredients.getFermentable(ferm, function (error, result) {
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
	ingredients.getHops( function (error, result) {
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
	ingredients.getHop(hop, function (error, result) {
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
	'hop': hop
};
