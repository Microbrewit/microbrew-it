var url = require('url'),
    utils = require('../app/util'),
    mock = require('../app/mock'),
    hops = require('../app/ingredients').hops;

    var hopsList = function (req, res) {
    console.log(JSON.stringify(req.session));
	hops.getHops( function (error, result) {
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

var hop = function (req, res) {
	var hop = req.params.hop;
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
				'aalow': req.body.aalow,
				'aahigh': req.body.aahigh,
				'flavours': req.body.flavours,
				'flavourdescription': req.body.flavourdescription,
				'origin': req.body.origin,
				'recommendedusageid': req.body.recommendedusageid,
				'substitutions': req.body.substitutions
				};
			console.log(hop);
			console.log(hop.aalow.length);
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
