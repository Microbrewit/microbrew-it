var url = require('url'),
utils = require('../app/util'),
mock = require('../app/mock');

var fermentables = function (req, res) {
	res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify(mock.fermentables));
};

var fermentable = function (req, res) {
	res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify(mock.fermentable));
}


exports = module.exports = {
	'fermentables': fermentables,
	'fermentable': fermentable
};
