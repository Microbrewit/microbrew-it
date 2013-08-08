var url = require('url'),
    utils = require('../app/util'),
    mock = require('../app/mock'),
    hops = require('../app/ingredients').hops;

    var hopsList = function (req, res) {
	hops.getHops( function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			console.log(req);
			response = utils.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var hop = function (req, res) {
	var hop = req.params.hop;
	console.log(hop);
	hops.getHop(hop, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = utils.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var updateHops = function (req, res) {
	var hop = {	'name': req.body.name,
				'aa': req.body.aa,
				'origin': req.body.origin,
				'flavor': req.body.flavor
				};
	hops.updateHop(hop, function (error, result) {
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
    'hops': hopsList,
    'hop' : hop,
    'updateHops': updateHops
};
