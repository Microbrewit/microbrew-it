'use strict';
var http = require('http'),
	config = require('../config'),
	mb = require('../ontology').mb,
	util = require('../util'),
	ts = require('../triplestore');


var getFermentables = function (callback) {
	var select = 	' SELECT DISTINCT ?fermentable ?label ?ppg ?colour ?type ?typeuri ?supplier ?supplieruri';
		select += 	' WHERE { ' ;
		select +=	' ?typeuri rdfs:subClassOf ' + mb.fermentables + '; rdfs:label ?type . ?fermentable a ?typeuri; rdfs:label ?label; ';
		select +=	mb.hasPPG + ' ?ppg; ' + mb.hasColour + ' ?colour .';
		select +=	' OPTIONAL {?fermentable ' + mb.suppliedBy + ' ?supplieruri . ';
		select +=	' ?supplieruri rdfs:label ?supplier . FILTER(LANG(?supplier) ="en") . } ';
		select += 	' FILTER(?typeuri != ' + mb.fermentables + ') . FILTER(?typeuri != ' + mb.extract + ')';
		select +=	' FILTER(LANG(?type) = "en") . }';
	console.log(select);
		ts.select(select, function (err, result) {
			if(err) {
				console.log(err);
				callback(err);
			} else {

				callback(null, apiFormattingFermentables(result));
			}
		});
};

var getFermentable = function (ferm, callback) {
	console.log(ferm);
	if(ferm.indexOf(mb.baseURI) != -1 ) { 
	var select =	' SELECT ?fermentable ?label ?ppg ?colour ?type ?typeuri ?supplier ?supplieruri';
		select +=	' WHERE { ';
		select +=	' <'+ ferm + '> rdfs:label ?label; rdf:type ?typeuri; rdf:type ' + mb.fermentables + ';' ;
		select +=	mb.hasPPG + ' ?ppg; ' + mb.hasColour + ' ?colour . ';
		select +=	' OPTIONAL { ?fermentable' + mb.suppliedBy + ' ?supplieruri . ?supplieruri rdfs:label ?supplier . FILTER(LANG(?supplier) ="en") . } ';
		select +=	' ?typeuri rdfs:label ?type . FILTER(LANG(?type) = "en") . ';
		select +=	' FILTER(?typeuri != ' + mb.fermentables + ') . FILTER(?typeuri != owl:NamedIndividual) .';
		select +=	' FILTER(?typeuri != rdfs:Resource) . FILTER(?typeuri != ' + mb.ingredient +  ') . ';
		select +=	' FILTER(LANG(?label) = "en") . ';
		select +=	' }'   	
	console.log(select);
		ts.select(select, function (err, result) {
			if(err) {
				console.log(err);
				callback(err);
			} else {

				callback(null, apiFormattingFermentables(result));
			}
		});

	} else {
		console.log('ERROR');
		callback(null)
	}
};

var apiFormattingFermentables = function (result) {
	console.log(result);
	var apiJson = {
			'meta': {
			'size':	result.results.bindings.length
			},
			'links': {
				'fermentables.maltster': {
					'href': 'http://api.microbrew.it/maltsters/:maltsterid/',
    				'type': 'maltster'
				}

			},
			'fermentables' :[
			]


	};
	for (var i = 0; i < result.results.bindings.length; i++) {
		if(result.results.bindings[i].supplieruri != null) {
			apiJson.fermentables[i] = {
				'id': result.results.bindings[i].fermentable.value,
				'href': result.results.bindings[i].fermentable.value,
				'fermentablename': result.results.bindings[i].label.value,
				'colour': result.results.bindings[i].colour.value,
				'ppg' : result.results.bindings[i].ppg.value,
				'type': result.results.bindings[i].type.value,
				'maltster': result.results.bindings[i].supplier.value,
				'links': {
				'maltsterid': result.results.bindings[i].supplieruri.value
				}

			}

		} else {
			apiJson.fermentables[i] = {
				'id': result.results.bindings[i].fermentable.value,
				'href': result.results.bindings[i].fermentable.value,
				'fermentablename': result.results.bindings[i].label.value,
				'colour': result.results.bindings[i].colour.value,
				'ppg' : result.results.bindings[i].ppg.value,
				'type': result.results.bindings[i].type.value
				
			}
		}
	}
	return apiJson;
};

exports = module.exports = {
	'getFermentables': getFermentables,
	'getFermentable': getFermentable

};