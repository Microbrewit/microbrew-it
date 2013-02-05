"use strict";
/*
* Beget function, as recommended by Douglas Crockford (http://javascript.crockford.com/prototypal.html)
*/
exports.beget = function (o) {
	var F = function () {};
    F.prototype = o;
    return new F();
};
