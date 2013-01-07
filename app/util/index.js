/*
* Beget function, as recommended by Douglas Crockford (http://javascript.crockford.com/prototypal.html)
*/
exports.beget = function (o) {
	function F() {};
    F.prototype = o;
    return new F();
}