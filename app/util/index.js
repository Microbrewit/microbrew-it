"use strict";
/*
* Beget function, as recommended by Douglas Crockford (http://javascript.crockford.com/prototypal.html)
*/
exports.beget = function (o) {
	var F = function () {};
    F.prototype = o;
    return new F();
};

exports.formatJsonResponse = function (params, response) {
	console.log(response);
	if(params.callback && params.callback.length > 0) {
		response = params.callback + "(" + JSON.stringify(response) + ");";
	} else {
		response = JSON.stringify(response);
	}
	console.log(response);
	return response;
};

exports.apiFormatting = function (result) {
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
}
