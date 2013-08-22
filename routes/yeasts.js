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
            head.statuscode = 200;
            res.writeHead(head.statuscode, head.contentType);
            res.end(JSON.stringify(result));
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
            head.statuscode = 200;
            res.writeHead(head.statuscode, head.contentType);
            res.end(JSON.stringify(result));
        }
    });
};

var liquidYeasts = function (req, res) {
	yeasts.getLiquidYeasts(function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var dryYeasts = function (req, res) {
	yeasts.getDryYeasts(function (error, result) {
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
    'yeasts': yeastList,
    'yeast' : yeast,
    'liquidYeasts' : liquidYeasts,
    'dryYeasts' : dryYeasts,
};
