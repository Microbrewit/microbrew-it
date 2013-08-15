var config = require('../config'),
  async = require('async'),
  mb = require('../ontology').mb,
  util = require('../util'),
  ts = require('../triplestore');

var getHops = function (callback) {
    var select =    ' SELECT *';
    select +=   ' WHERE { ';
    select +=   ' ?hop rdf:type ' + mb.hops + '; rdfs:label ?label ;' + mb.hasID + ' ?id ; ';
    select +=   mb.aalow + '?aalow ; ' + mb.aahigh + ' ?aahigh ; ' + mb.recommendedUsage + ' ?recommendedUsageid; ';
    select +=   mb.origin + '?originid . ';
    select +=   ' OPTIONAL {?hop ' + mb.flavourDescription +  ' ?flavourDescription } .';
    select +=   ' ?originid rdfs:label ?origin . ?recommendedUsageid rdfs:label ?recommendedUsage . ';
    select +=   ' FILTER(LANG(?label) = "en") . }';
    console.log(select);
    ts.graph('<' + mb.baseURI + 'HopsGraph>', function (err, hopGraph) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        apiFormattingHops(hopGraph, function (error, result) {
      			if(error) {
      				callback(error)
      			} else {
      				callback(null, result);
      			}
      		});
      }
    });
  };

var getHop = function (hopID, callback) {
	var apiJson = {
			'meta': {
			'size':	1;
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
		}
    if (hopID.length > 12) {
	getHops(function (err, res) {
		if(err) {
			callback(err);
		} else {
			for (var i = res.hops.length - 1; i >= 0; i--) {
				if(res.hops[i].id === hopID) {
					apiJson.hops.push(res.hops[i]);
					callback(null, apiJson);
				}
			};
		}
	})
  } else {
  	console.log('ERROR');
  	callback(null, 'Not a Hops');
  }
};

var apiFormattingHops = function (hopGraph, callback) {

	var idArray = [];
	var apiJson = {
			'meta': {
			'size':	hopGraph.length
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
	var j = 0;
	for (var key in hopGraph) {
			if(typeof hopGraph[key][mb.baseURI + 'hasID'] !== 'undefined') {
			apiJson.hops[j] = {
						'id': hopGraph[key][mb.baseURI + 'hasID'][0].value,
						'href': key,
						'name': hopGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value,
						'aalow': hopGraph[key][mb.baseURI + 'hasAlphaAcidLowRange'][0].value,
						'aahigh': hopGraph[key][mb.baseURI + 'hasAlphaAcidHighRange'][0].value,
						'substitutions':[],
						'flavour': [],
			 		'links': {
						'originid': hopGraph[key][mb.baseURI + 'origin'][0].value,
						'recommendedusageid': hopGraph[key][mb.baseURI + 'recommendedUsage'][0].value,

			   }
		}


		if(typeof hopGraph[key][mb.baseURI + 'flavourDescription'] !== 'undefined') {
				console.log(hopGraph[key][mb.baseURI + 'flavourDescription'][0].value);
	 			apiJson.hops[j].flavourdescription = hopGraph[key][mb.baseURI + 'flavourDescription'][0].value;
			}
	 	if(typeof hopGraph[key][mb.baseURI + 'hasFlavour'] !== 'undefined') {
	 	for (var i = hopGraph[key][mb.baseURI + 'hasFlavour'].length - 1; i >= 0; i--) {
	 		apiJson.hops[j].flavour.push(hopGraph[key][mb.baseURI + 'hasFlavour'][i].value);
	 	};
	 }
	  	if(typeof hopGraph[key][mb.baseURI + 'possibleSubstitutions'] !== 'undefined') {
	 	for (var i = hopGraph[key][mb.baseURI + 'possibleSubstitutions'].length - 1; i >= 0; i--) {
	 		apiJson.hops[j].substitutions.push(hopGraph[key][mb.baseURI + 'possibleSubstitutions'][i].value);
	 	};
	 }
	}
	j++

}
	callback(null,apiJson);
}

var getHopFlavour = function (hop, callback) {
	var select =	' SELECT DISTINCT * ';
		select +=	' WHERE { ?hop ' + mb.hasID + ' "' + hop.id + '" ; ' + mb.hasID + ' ?id . ';
		select +=	' OPTIONAL { ?hop ' + mb.flavour + ' ?flavour } .';
		select +=	' } ';
		console.log(select);
	ts.select(select, function (err, res) {
		if (err) {
			callback(err);
		} else
		callback(null, res);
	});
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
