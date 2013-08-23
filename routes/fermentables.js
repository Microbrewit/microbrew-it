var url = require('url'),
    util = require('../app/util'),
    mock = require('../app/mock'),
    fermentables = require('../app/ingredients').fermentables;


var fermentablesList = function (req, res) {
	fermentables.getFermentables( function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var fermentable = function (req, res) {
	var ferm = req.params.fermentable;
	fermentables.getFermentable(ferm, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var grains = function (req, res) {
	fermentables.getGrains(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var grain = function (req, res) {
	var grainID = req.params.grain;
	fermentables.getGrain(grainID, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var sugars = function (req, res) {
	fermentables.getSugars(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var sugar = function (req, res) {
	var sugarID = req.params.sugar;
	fermentables.getSugar(sugarID, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var dryExtracts = function (req, res) {
	fermentables.getDryExtracts(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var dryExtract = function (req, res) {
	var dryID = req.params.dryextract;
	fermentables.getDryExtract(dryID, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var liquidExtracts = function (req, res) {
	fermentables.getLiquidExtracts(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var liquidExtract = function (req, res) {
	var liquidID = req.params.liquidextract;
	fermentables.getLiquidExtract(liquidID, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var extracts = function (req, res) {
	fermentables.getExtracts(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};

var extract = function (req, res) {
	var extractID = req.params.extract;
	fermentables.getExtract(extractID, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
	});
};


exports = module.exports = {
    'fermentables': fermentablesList,
    'fermentable' : fermentable,
    'grains': grains,
    'grain': grain,
    'sugars': sugars,
    'sugar': sugar,
    'dryExtracts': dryExtracts,
    'dryExtract': dryExtract,
    'liquidExtracts': liquidExtracts,
    'liquidExtract': liquidExtract,
    'extracts': extracts,
    'extract': extract,


};
