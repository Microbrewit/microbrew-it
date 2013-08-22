'use strict';
var http = require('http'),
    config = require('../config'),
    mb = require('../ontology').mb,
    async = require('async'),
    ts = require('../triplestore');

var apiFormattingYeasts = function (yeastGraph, callback) {

	var yeastArray = [],
	j = 0;
	for(var key in yeastGraph){
		yeastArray.push({
			'id': yeastGraph[key][mb.baseURI + 'hasID'][0].value,
			'href': key,
			'name': yeastGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value,
			'suppliedby': yeastGraph[key][mb.baseURI + 'suppliedBy'][0].value,
			'comment': yeastGraph[key]['http://www.w3.org/2000/01/rdf-schema#comment'][0].value
	});

	j++
	}
	callback(null, yeastArray);

};

var getYeasts = function (callback) {
	async.parallel({
		liquidyeasts : function(callback) {
			getLiquidYeasts(function (error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null, result);
				}
			});
		},
		dryyeasts : function(callback) {
			getDryYeasts(function (error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null, result);
				}
			});
		}
	}, function (error,result) {
		if(error) {
			callback(error);
		} else {
			console.log(result.dryyeasts.length)
		var apiJson = {
        	'meta': {
          		'size': result.dryyeasts.length + result.liquidyeasts.length
        		},
        	'links': {

          	},
      		};
		apiJson.yeasts = result;
			callback(null,apiJson);
		}
	});

};

var getYeast = function (yeast, callback) {
	var select =	' SELECT DISTINCT * ';
		select +=	' WHERE { ';
		select +=	' <' + yeast + '> rdf:type ' + mb.yeast + ' ; rdfs:label ?label; rdf:type ?typeuri . ?yeast rdfs:label ?label . ';
		select +=	' FILTER(?typeuri != ' + mb.yeast + ') . FILTER(?typeuri != rdfs:Resource) .' ;
		select +=	' FILTER(?typeuri != owl:NamedIndividual) . FILTER(?typeuri != ' + mb.ingredient + ') .'
		select +=	' }';
		console.log(select);
		ts.select(select, function (err, result) {
			if(err) {
				console.log(err);
				callback({'statuscode': 500, 'error': err});
			} else {
				callback(null, {'statuscode': 200, 'result': result});
			}
		});
};

var getLiquidYeasts = function (callback) {
	ts.graph('<' + mb.baseURI + 'Liquid_Yeast>', function (error, liquidYeastGraph) {
		if(error) {
			callback(error);
		} else {
			apiFormattingYeasts(liquidYeastGraph, function (err, res) {
				if(err) {
					callback(err);
				} else {
					callback(null, res);
				}
			});
		//callback(null, liquidYeastGraph);
		}
	});
}

var getDryYeasts = function (callback) {
	ts.graph('<' + mb.baseURI + 'Dry_Yeast>', function (error, dryYeastGraph) {
		if(error) {
			callback(error);
		} else {
			apiFormattingYeasts(dryYeastGraph, function (err, res) {
				if(err) {
					callback(err);
				} else {
					callback(null, res);
				}
			});
		//callback(null, liquidYeastGraph);
		}
	});
}

exports = module.exports = {
    'getYeasts': getYeasts,
    'getYeast': getYeast,
    'getLiquidYeasts': getLiquidYeasts,
    'getDryYeasts': getDryYeasts,
};
