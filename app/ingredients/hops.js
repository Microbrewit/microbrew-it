var config = require('../config'),
	mb = require('../ontology').mb,
	ts = require('../triplestore');

var getHops = function (callback) {
	var select = 	' SELECT *';
		select += 	' WHERE { ' ;
		select +=	' ?hop rdf:type ' + mb.hops + '; rdfs:label ?label ; ';
		select +=	mb.hasAlphaAcid + '?alphaacid ; ' + mb.recommendedUsage +' ?recommendedUsageid;';
		select +=	mb.origin + '?originid; ' + mb.flavorDescription +  ' ?flavorDescription . ';
		select += 	'?originid rdfs:label ?origin . ?recommendedUsageid rdfs:label ?recommendedUsage ';
		select +=	' FILTER(LANG(?label) = "en") . }';
	console.log(select);
		ts.select(select, function (err, result) {
			if(err) {
				console.log(err);
				callback(err);
			} else {

				callback(null, apiFormattingHops(result));
			}
		});
};

var getHop = function (hop, callback) {
	if(hop.indexOf(mb.baseURI) != -1 ) { 
	var select = 	' SELECT *';
		select +=	' WHERE { ';
		select +=	'<' + hop + '> rdf:type ' + mb.hops + '; rdfs:label ?label ; ';
		select +=	mb.hasAlphaAcid + '?alphaacid ; ' + mb.recommendedUsage +' ?recommendedUsageid;';
		select +=	mb.origin + '?originid ; ' + mb.flavorDescription +  ' ?flavorDescription . ?hop rdfs:label ?label . ';
		select +=	' ?recommendedUsageid rdfs:label ?recommendedUsage . ?originid rdfs:label ?origin'
		select +=	' FILTER(LANG(?label) = "en") . }';
		console.log(select);
		ts.select(select, function (err, result) {
			if(err) {
				console.log(err);
				callback(err);
			} else {

				callback(null, apiFormattingHops(result));
			}
		});
	} else {
		console.log('ERROR');
		callback(null, 'Not a Hops');
	}
};

var apiFormattingHops = function (result) {
	var apiJson = {
			'meta': {
			'size':	result.results.bindings.length
			},
			'links': {
				'hops.maltster': {
					'href': 'http://api.microbrew.it/hops/recommendeduses/:recommendeduseid',
    				'type': 'recommendedUses'
				},
				'hops.origin': {
   					'href': 'http://api.microbrew.it/origin/:originid',
   					'type': 'origin'
  				},

			},
			'hops' :[
			]


	};

	for (var i = 0; i < result.results.bindings.length; i++) {
		apiJson.hops[i] = {
				'id': result.results.bindings[i].hop.value,
				'href': result.results.bindings[i].hop.value,
				'name': result.results.bindings[i].label.value,
				'alphaacid': result.results.bindings[i].alphaacid.value,
				'flavor' : result.results.bindings[i].flavorDescription.value,
				'origin' : result.results.bindings[i].origin.value,
				'recommendedUsage' : result.results.bindings[i].recommendedUsage.value,
				'links': {
				'originid': result.results.bindings[i].originid.value,
				'recommendedUsage': result.results.bindings[i].recommendedUsageid.value			
			}
		}
	}
	return apiJson;
};

exports = module.exports = {
    'getHops': getHops,
    'getHop' : getHop
};