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

exports = module.exports = {
    'yeasts': yeastList
};