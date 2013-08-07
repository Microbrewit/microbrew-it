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


exports = module.exports = {
    'fermentables': fermentablesList,
    'fermentable' : fermentable
};