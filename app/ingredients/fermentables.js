var config = require('../config'),
	mb = require('../ontology').mb,
	ts = require('../triplestore'),
	async = require('async');

var getFermentables = function (callback) {
	async.parallel({
		grains : function(callback) {
			getGrains(function (error,result) {
				if(error) {
					callback(error)
				} else {
					callback(null,result);
				}
			});
		},
		sugars : function(callback) {
			getSugars(function (error,result) {
				if(error) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		extracts : function(callback) {
			getExtracts(function (error, result) {
				if(error){
					callback(error);
				} else {
					callback(null,result);
				}
			});
		}
	}, function(error, result) {
		if(error) {
			callback(error);
		} else {
		var apiJson = {
        'meta': {
          'size': result.sugars.length + result.extracts.length + result.grains.length
        },
        'links': {

          },
      };
      	apiJson.fermentables = result;
		callback(null, apiJson);
		}
	});
};

var getFermentable = function (ferm, callback) {
	console.log(ferm);
	if(ferm.indexOf(mb.baseURI) != -1 ) {
	var select =	' SELECT ?fermentable ?label ?ppg ?colour ?type ?typeuri ?supplier ?supplieruri';
		select +=	' WHERE { ';
		select +=	' <'+ ferm + '> rdfs:label ?label; rdf:type ?typeuri; rdf:type ' + mb.fermentables + ';' ;
		select +=	mb.hasPPG + ' ?ppg; ' + mb.hasColour + ' ?colour . ?fermentable rdfs:label ?label ';
		select +=	' OPTIONAL {<'+ ferm + '> ' + mb.suppliedBy + ' ?supplieruri . ?supplieruri rdfs:label ?supplier . FILTER(LANG(?supplier) ="en") . } ';
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
		callback(null,'Not a fermentable')
	}
};

var apiFormattingFermentables = function (fermentableGraph, callback) {

	var fermentablesArray = [],
	j = 0;
	for(key in fermentableGraph) {
		fermentablesArray.push({
		'id' : fermentableGraph[key][mb.baseURI + 'hasID'][0].value,
		'href': key,
		'name': fermentableGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value,
		'colour' : fermentableGraph[key][mb.baseURI + 'hasColour'][0].value,
		'ppg': fermentableGraph[key][mb.baseURI + 'hasPPG'][0].value,
		});
		if(typeof fermentableGraph[key][mb.baseURI + 'suppliedBy'] !== 'undefined') {
			fermentablesArray[j].suppliedbyid = fermentableGraph[key][mb.baseURI + 'suppliedBy'][0].value
		}
		j++
	}
	callback(null,fermentablesArray);
};

var getGrains = function (callback) {
	ts.graph('<' + mb.baseURI + 'Grain>', function(error, grainGraph) {
		if(error) {
			callback(error);
		} else {
			apiFormattingFermentables(grainGraph, function(err, apiJson){
				if(err) {
					callback(err);
				} else {
					callback(null, apiJson);
				}
			});

			//callback(null,grainGraph);
		}
	});
};

var getSugars = function (callback) {
	ts.graph('<' + mb.baseURI + 'Sugar>', function(error, sugarGraph) {
		if(error) {
			callback(error);
		} else {
			apiFormattingFermentables(sugarGraph, function(err, apiJson){
				if(err) {
					callback(err);
				} else {
					callback(null, apiJson);
				}
			});

			//callback(null,sugarGraph);
		}
	});
};

var getDryExtracts = function (callback) {
	ts.graph('<' + mb.baseURI + 'Dry_Extract>', function(error, dryExtractGraph) {
		if(error) {
			callback(error);
		} else {
			apiFormattingFermentables(dryExtractGraph, function(err, apiJson){
				if(err) {
					callback(err);
				} else {
					callback(null, apiJson);
				}
			});

			//callback(null,dryExtractGraph);
		}
	});
};

var getLiquidExtracts = function (callback) {
	ts.graph('<' + mb.baseURI + 'Liquid_Extract>', function(error, liquidExtractGraph) {
		if(error) {
			callback(error);
		} else {
			apiFormattingFermentables(liquidExtractGraph, function(err, apiJson){
				if(err) {
					callback(err);
				} else {
					callback(null, apiJson);
				}
			});

			//callback(null,liquidExtractGraph);
		}
	});
};

var getExtracts = function (callback) {
	console.log('getExtracts');
	async.parallel({
		liquidextract : function (callback) {
			getLiquidExtracts( function(error, result) {
				if(error) {
					console.log('Liquid Error');
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		dryextract : function (callback) {
			getDryExtracts( function(error, result) {
				if(error) {
					callback(error);
					console.log('Dry Error');
				} else {
					callback(null,result);
				}
			});
		},
	}, function (err, res) {
		callback(null,res);
	});
}

exports = module.exports = {
    'getFermentables': getFermentables,
    'getFermentable': getFermentable,
    'getGrains': getGrains,
    'getSugars': getSugars,
    'getDryExtracts' : getDryExtracts,
    'getLiquidExtracts' : getLiquidExtracts,
    'getExtracts': getExtracts,
};
