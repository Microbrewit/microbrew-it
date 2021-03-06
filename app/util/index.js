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
	if(params.callback && params.callback.length > 0) {
		response = params.callback + "(" + JSON.stringify(response) + ");";
	} else {
		response = JSON.stringify(response);
	}
	return response;
};

exports.createID = function () {
var	id = new Date().getTime() + Math.floor(Math.random()*100);
	return id;
};
