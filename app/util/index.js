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

