var url = require('url'),
    utils = require('../app/util'),
    mock = require('../app/mock'),
    fermentables = require('../app/ingredients').fermentables;


var fermentablesList = function (req, res) {
	fermentables.getFermentables( function (error, result) {
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
	fermentables.getFermentable(ferm, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var grains = function (req, res) {
	var ferm = req.params.fermentable;
	fermentables.getGrains(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var sugars = function (req, res) {
	var ferm = req.params.fermentable;
	fermentables.getSugars(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var dryExtracts = function (req, res) {
	var ferm = req.params.fermentable;
	fermentables.getDryExtracts(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var liquidExtracts = function (req, res) {
	var ferm = req.params.fermentable;
	fermentables.getLiquidExtracts(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var extracts = function (req, res) {
	var ferm = req.params.fermentable;
	fermentables.getExtracts(function (error, result) {
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
    'fermentables': fermentablesList,
    'fermentable' : fermentable,
    'grains': grains,
    'sugars': sugars,
    'dryExtracts': dryExtracts,
    'liquidExtracts': liquidExtracts,
    'extracts': extracts,


};
