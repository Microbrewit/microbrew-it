var url = require('url'),
utils = require('../app/util'),
mock = require('../app/mock'),
ingredients = require('../app/ingredients');

var fermentables = function (req, res) {
	ingredients.getFermentables( function (error, result) {
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
	ingredients.getFermentable(ferm, function (error, result) {
		if(error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type' : 'application/json'});
    		res.end(JSON.stringify(result));
			}
	});
};

var apiFormattingFermentables = function (result) {
	console.log(result);
	var apiJson = {
			'meta': {
			'size':	result.results.bindings.length
			},
			'links': {

			},
			'fermentables' :[
			]


	};
	for (var i = 0; i < result.results.bindings.length; i++) {
		apiJson.fermentables[i] = {
			'id': result.results.bindings[i].fermentable.value,
			'href': result.results.bindings[i].fermentable.value,
			'label': result.results.bindings[i].label.value,
			'colour': result.results.bindings[i].colour.value,
			'ppg' : result.results.bindings[i].ppg.value,
			'type': result.results.bindings[i].type.value
		}
	}
	return apiJson;
};

exports = module.exports = {
	'fermentables': fermentables,
	'fermentable': fermentable
};
