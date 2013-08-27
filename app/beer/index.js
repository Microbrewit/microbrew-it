(function(){
  'use strict';
var config = require('../config'),
	mb = require('../ontology').mb,
	ts = require('../triplestore'),
	prefix = require('../ontology').prefix,
	origin = require('../origin'),
	async = require('async');

var apiFormattingBeerStyles = function (beerStyleGraph, callback) {
	var beerStyleArray = [],
	j = 0,
	apiJson = {
		'meta': {

		},
		'beerstyles': {
			'ale': [],
			'lager': [],
			'mixed': []
		}
	};
	async.series({
	one: function (callback) {
		var subClass;
		var obj;
			for(var key in beerStyleGraph) {
				if(typeof beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'] !== 'undefined') {
					if(beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'][0].value === mb.baseURI + 'Ale') {
							subClass = key.replace(mb.baseURI,'').toLowerCase();
							console.log(subClass);
							obj = JSON.parse('{ "name" : "' + beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value + '", "href" :"' + key + '", "' + subClass + '": []}');
							apiJson.beerstyles.ale.push(obj);
					}
					if(beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'][0].value === mb.baseURI + 'Lager') {
							subClass = key.replace(mb.baseURI,'').toLowerCase();
							console.log(subClass);
							obj = JSON.parse('{ "name" : "' + beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value + '", "href" :"' + key + '", "' + subClass + '": []}');
							apiJson.beerstyles.lager.push(obj);
					}
					if(beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'][0].value === mb.baseURI + 'Mixed') {
							subClass = key.replace(mb.baseURI,'').toLowerCase();
							console.log(subClass);
							obj = JSON.parse('{ "name" : "' + beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value + '", "href" :"' + key + '", "' + subClass + '": []}');
							apiJson.beerstyles.mixed.push(obj);
					}
					}
				j++;
				}
				callback();
	},
	ale: function (callback) {
		var subClassOf,
		obj;
		for(var key in beerStyleGraph) {
			if(typeof beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'] !== 'undefined') {
				for (var i = apiJson.beerstyles.ale.length - 1; i >= 0; i--) {
					if(beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'][0].value === apiJson.beerstyles.ale[i].href) {
							subClassOf = apiJson.beerstyles.ale[i].href.replace(mb.baseURI,'').toLowerCase();
							apiJson.beerstyles.ale[i][subClassOf].push({'name': beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value, 'href': key});
					}
				}
			}
		}
		callback();
	},
	lager: function (callback) {
	var subClassOf,
		obj;
		for(var key in beerStyleGraph) {
			if(typeof beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'] !== 'undefined') {
				for (var i = apiJson.beerstyles.lager.length - 1; i >= 0; i--) {
					if(beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'][0].value === apiJson.beerstyles.lager[i].href) {
							subClassOf = apiJson.beerstyles.lager[i].href.replace(mb.baseURI,'').toLowerCase();
							apiJson.beerstyles.lager[i][subClassOf].push({'name': beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value, 'href': key});
					}
				}
			}
		}
		callback();
	},
	mixed: function (callback) {
	var subClassOf,
		obj;
		for(var key in beerStyleGraph) {
			if(typeof beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'] !== 'undefined') {
				for (var i = apiJson.beerstyles.mixed.length - 1; i >= 0; i--) {
					if(beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf'][0].value === apiJson.beerstyles.mixed[i].href) {
							subClassOf = apiJson.beerstyles.mixed[i].href.replace(mb.baseURI,'').toLowerCase();
							apiJson.beerstyles.mixed[i][subClassOf].push({'name': beerStyleGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value, 'href': key});
					}
				}
			}
		}
		callback();
	},
	}, function (err) {
		if(err) {
			callback(err);
		} else {
			apiJson.meta.size = apiJson.beerstyles.ale.length + apiJson.beerstyles.lager.length + apiJson.beerstyles.mixed.length;
		}

	});
	callback(null,apiJson);
};


var getBeerStyles = function(callback) {
	var graph = '<' + mb.baseURI + 'BeerStyle>';
	ts.graph(graph, function (err,beerStyleGraph) {
		if(err) {
			callback(err);
		} else {
				apiFormattingBeerStyles(beerStyleGraph, function (err, apiJson) {
					if(err) {
						callback(err);
					} else {
						callback(null,apiJson);
					}
				});
			
			//callback(null,beerStyleGraph);
		}
	});
};


exports = module.exports = {
	'getBeerStyles':getBeerStyles,

};

})();