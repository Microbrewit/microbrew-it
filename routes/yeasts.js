var url = require('url'),
    utils = require('../app/util'),
    mock = require('../app/mock'),
    yeasts = require('../app/ingredients').yeasts;


var yeastList = function(req, res) {
    var response = {},
        head = {
            'statuscode': 0,
            'contentType': {'Content-Type': 'application/json'}
        };

    yeasts.getYeasts(function (error, result) {
        if(error) {
            head.statuscode = error.statuscode;
            response = error;
            res.writeHead(head.statuscode, head.contentType);
            res.end(JSON.stringify(response));
        } else {
			response = utils.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
    });
};

var yeast = function(req, res) {
    var response = {},
        head = {
            'statuscode': 0,
            'contentType': {'Content-Type': 'application/json'}
        },
        yeast = req.params.yeast;

    yeasts.getYeast(yeast, function (error, result) {
        if(error) {
            head.statuscode = error.statuscode;
            response = error;
            res.writeHead(head.statuscode, head.contentType);
            res.end(JSON.stringify(response));
        } else {
			response = utils.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(response);
			}
    });
};

var liquidYeasts = function (req, res) {
	yeasts.getLiquidYeasts(function (error, result) {
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

var liquidYeast = function (req, res) {
	var liquidID = req.params.liquidyeast;
	yeasts.getLiquidYeast(liquidID, function (error, result) {
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

var dryYeasts = function (req, res) {
	yeasts.getDryYeasts(function (error, result) {
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

var dryYeast = function (req, res) {
	var dryID = req.params.dryyeast;
	yeasts.getDryYeast(dryID, function (error, result) {
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


exports = module.exports = {
    'yeasts': yeastList,
    'yeast' : yeast,
    'liquidYeasts' : liquidYeasts,
    'liquidYeast': liquidYeast,
    'dryYeasts' : dryYeasts,
    'dryYeast': dryYeast,
};
