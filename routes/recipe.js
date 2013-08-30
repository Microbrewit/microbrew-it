(function(){
  'use strict';
var util = require('../app/util'),
	mock = require('../app/mock'),
    recipe = require('../app/recipe');


var addRecipe = function (req, res) {
	var mockRecipe = mock.recipe;
	recipe.addRecipe(mockRecipe, function (error, result) {
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
	'addRecipe': addRecipe,

};

})();
