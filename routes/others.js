var url = require('url'),
utils = require('../app/util'),
mock = require('../app/mock'),
others = require('../app/ingredients').others;





var othersList = function (req, res) {
	others.getOthers( function (error, result) {
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
	'others': othersList
};
