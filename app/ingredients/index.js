'use strict';
var http = require('http'),
	config = require('../config'),
	mb = require('../ontology').mb,
	util = require('../util'),
	ts = require('../triplestore');


var getFermentables = function (callback) {
	var select = 	'SELECT DISTINCT ?fermentable ?label ?ppg ?colour ?type ?typeuri ';
		select += 	'WHERE { ' ;
		select +=	'?typeuri rdfs:subClassOf ' + mb.fermentables + '; rdfs:label ?type . ?fermentable rdf:type ?typeuri; rdfs:label ?label; ' + mb.hasPPG + ' ?ppg; ' + mb.hasColour + ' ?colour . ';
		select += 	'FILTER(?typeuri != ' + mb.fermentables + ') . ';
		select +=	'FILTER(LANG(?type) = "en") . }';
	console.log(select);
		ts.select(select, function (err, result) {
			if(err) {
				console.log(err);
				callback(err);
			} else {

				callback(null, util.apiFormatting(result));
			}
		});
};


exports = module.exports = {
	'getFermentables': getFermentables

};