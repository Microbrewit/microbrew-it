var config = require('../config'),
	mb = require('../ontology').mb,
	ts = require('../triplestore');


var getOthers = function (callback) {
	var select =	' SELECT * ';
		select +=	' WHERE { ';
		select +=	' ?other rdf:type ' + mb.other + ' ; rdfs:label ?label; rdf:type ?typeuri . ?typeuri rdfs:label ?type. ';
		select +=	' FILTER(?typeuri !=  ' + mb.ingredient + ') . FILTER(?typeuri != owl:NamedIndividual) . FILTER(?typeuri != rdfs:Resource) . ';
		select +=	' } ';
		console.log(select);
		ts.select(select, function (err, result) {
			if(err) {
				console.log(err);
				callback(err);
			} else {

				callback(null, apiFormatOthers(result));
			}
		});

};

var apiFormatOthers = function (result) {
	var apiJson = {
		'meta': {
			'size':	result.results.bindings.length
			},
		'links': {
				'others.type': {
					'href': 'http://api.microbrew.it/others/types/:type',
    				'type': 'type'
				},
			},
		'others' : [
			]
		};
	for (var i = 0; i < result.results.bindings.length; i++) {
		
			apiJson.others[i] = {
				'id':	result.results.bindings[i].other.value,
				'href': result.results.bindings[i].other.value,
				'name': result.results.bindings[i].label.value,
				'type': result.results.bindings[i].type.value,
				'links': {
					'typeid': result.results.bindings[i].typeuri.value
				}  
			}
		}
	return apiJson;
	};
expots = module.exports = {
    'getOthers': getOthers,
};