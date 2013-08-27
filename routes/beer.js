(function(){
  'use strict';
var util = require('../app/util'),
    beer = require('../app/beer');

var beerStyles = function (req, res) {
	beer.getBeerStyles( function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
		var response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
			res.end(response);
			}
	});
};


exports = module.exports = {
	'beerStyles':beerStyles,

};

})();

