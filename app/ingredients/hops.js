var config = require('../config'),
    mb = require('../ontology').mb,
    util = require('../util'),
    ts = require('../triplestore');

var getHops = function (callback) {
	var select = 	' SELECT *';
		select += 	' WHERE { ' ;
		select +=	' ?hop rdf:type ' + mb.hops + '; rdfs:label ?label ;' + mb.hasID + ' ?id ; ';
		select +=	mb.aalow + '?aalow ; ' + mb.aahigh + ' ?aahigh ; ' + mb.recommendedUsage +' ?recommendedUsageid; ';
		select +=	mb.origin + '?originid . '
		select +=	' OPTIONAL {?hop ' + mb.flavourDescription +  ' ?flavourDescription } .';
		select +=	' OPTIONAL {?hop ' + mb.flavour + ' ?flavour } .';
		select +=	' OPTIONAL {?hop ' + mb.substitutions + ' ?substitutionsid . ?substitutionsid rdfs:label ?substitutions } . ';
		select += 	' ?originid rdfs:label ?origin . ?recommendedUsageid rdfs:label ?recommendedUsage . ';
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
	console.log('before for loop:')
	for (var i = 0; i < result.results.bindings.length; i++) {
			apiJson.hops[i] = {
						'id': result.results.bindings[i].id.value,
						'href': result.results.bindings[i].hop.value,
						'name': result.results.bindings[i].label.value,
						'aalow': result.results.bindings[i].aalow.value,
						'aahigh': result.results.bindings[i].aahigh.value,
						'origin' : result.results.bindings[i].origin.value,
						'recommendedusage' : result.results.bindings[i].recommendedUsage.value,
						'substitutions':[],
						'flavour': [],
						'links': {
						'originid': result.results.bindings[i].originid.value,
						'recommendedusageid': result.results.bindings[i].recommendedUsageid.value,
						'substitutionsid':[]

			}
		}
			if(typeof result.results.bindings[i].flavourDescription.value !== 'undefined') {
				apiJson.hops[i].flavourdescription = result.results.bindings[i].flavourDescription.value

			}
			if (typeof result.results.bindings[i].flavour !== 'undefined') {
				apiJson.hops[i].flavour.push(result.results.bindings[i].flavour.value);
				}
			if (typeof result.results.bindings[i].substitutions !== 'undefined') {
				apiJson.hops[i].substitutions.push(result.results.bindings[i].substitutions.value);
				apiJson.hops[i].links.substitutionsid.push(result.results.bindings[i].substitutionsid.value);
				}
			}
	return apiJson;
};

var updateHop = function (hop, callback) {
	console.log(hop);
	var hopURI = '<' + mb.baseURI + hop.name + '>',
		hopID = util.createID();
		ask = ' ASK { ?hop rdf:type ' + mb.hops + '; rdfs:label "' + hop.name + '" }',
		ts.ask(ask, function (err, result) {
			if(err) {
				console.log(err);
				callback(err);
			} else {
			console.log(typeof result + result);
			if(result === false) {
			var insert =	' INSERT DATA { ' + hopURI + ' rdf:type ' + mb.hops + '; ' + mb.hasID + ' ' + hopID + ' ;';
				insert +=	' rdfs:label "' + hop.name + '"; ' + mb.aalow + ' ' + hop.aalow + '; ';
				//optinal does hops addition containd flavor decribtion
				if(mb.origin.length < 0) {
				insert +=	mb.flavorDescription + ' "' + hop.flavor + '" ;';
				}
				//optional value, does hops contain origin.
				if(mb.origin.indexOf(mb.baseURI) === -1) {
					insert += mb.origin + ' ' + mb.originuri;
				}
				insert +=	' } '
				console.log(insert);
			ts.insert(insert, function (error, insertResult) {
				if(err) {
					console.log(error);
					callback(error);
				} else {
					callback(null, insertResult);
				}
			});
			} else {
				console.log("softUpdateHop");
				softUpdateHop(hop);
			}
		}
		});
};

var softUpdateHop = function (hop, callback) {

	var insert = 	' INSERT { ?hop rdfs:label "' + hop.name + '" ;'
	if(hop.origin.length > 0 ) {
		insert +=	mb.origin + ' ' + hop.origin + '; ';
	}
	if(hop.aalow.length > 0 ) {
		insert +=	mb.aalow + ' ' + hop.aalow + '; ';
	}
	if(hop.aahigh.length > 0 ) {
		insert +=	mb.aahigh + ' ' + hop.aahigh + '; ';
	}
	if(hop.flavourdescription.length > 0 ) {
		insert +=	mb.flavourDescription + ' "' + hop.flavourdescription + '"; ';
	}
	if(hop.flavours.length > 0 ) {
		var flavours = JSON.parse(hop.flavours);
		for (var i = 0; i < flavours.length; i++) {

		insert +=	mb.flavour + ' "' + flavours[i] + '"; ';
		}
	}
	if(hop.recommendedusageid.length > 0 ) {
		insert +=	mb.recommendedUsage + ' ' + hop.recommendedusageid + '; ';
	}
	if(hop.substitutions.length > 0 ) {
		var substitutions = JSON.parse(hops.substitutions);
		for (var i = 0; i < substitutions.length; i++) {
		insert +=	mb.recommendedUsage + ' ' + substitutions[i] + '; ';
		}
	}
	insert +=	' }'
	var where = 	' WHERE { ?hops rdfs:label "' + hop.name + '"" .';
		where +=	' FILTER(?hops ' + mb.origin + ' ?origin || ?hops ' + mb.aalow + ' ?aalow )';
		where +=	' }'
	console.log(insert + where);
}
exports = module.exports = {
    'getHops': getHops,
    'getHop' : getHop,
    'updateHop': updateHop
};
