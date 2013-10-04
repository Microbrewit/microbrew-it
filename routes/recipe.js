(function(){
  'use strict';
var util = require('../app/util'),
	mock = require('../app/mock'),
    recipe = require('../app/recipe');


var addRecipe = function (req, res) {
	var mockRecipe = mock.recipe;
	var recipeData = JSON.parse(req.body.recipe);
	console.log(req);
	recipe.addRecipe(recipe, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			console.log('else');
		var response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
			res.end(response);
			}
	});
};

var getRecipe = function (req, res) {
	var recipeID = req.params.recipe;
	recipe.getRecipe(recipeID, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			console.log('else');
		var response = util.formatJsonResponse(req.query, result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
			res.end(response);
			}
	});
};

exports = module.exports = {
	'addRecipe': addRecipe,
	'getRecipe': getRecipe

};

})();
