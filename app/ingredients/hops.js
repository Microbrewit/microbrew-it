var config = require('../config'),
  async = require('async'),
  mb = require('../ontology').mb,
  prefix = require('../ontology').prefix,
  util = require('../util'),
  ts = require('../triplestore'),
  origin = require('../origin');

var apiFormattingHops = function (hopGraph, callback) {
    var j = 0;
    var hopsArray = [];

    async.series({
     one: function (callback) {
        for (var key in hopGraph) {
			if(typeof hopGraph[key][mb.baseURI + 'hasID'] !== 'undefined') {

			hopsArray[j] = {
						'id': hopGraph[key][mb.baseURI + 'hasID'][0].value,
						'href': key,
						'name': hopGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value,
						'substitutions':[],
						'flavour': [],
						'links': {},
				}

			  if(typeof hopGraph[key][mb.baseURI + 'origin'] !== 'undefined') {
			  	hopsArray[j].links.originid = hopGraph[key][mb.baseURI + 'origin'][0].value
			  		}

               if(typeof hopGraph[key][mb.baseURI + 'recommendedUsage'] !== 'undefined') {
			  	hopsArray[j].links.recommendedusageid = hopGraph[key][mb.baseURI + 'recommendedUsage'][0].value
			  		}

			  if(typeof hopGraph[key][mb.baseURI + 'hasAlphaAcidLowRange'] !== 'undefined') {
			    hopsArray[j].aalow = hopGraph[key][mb.baseURI + 'hasAlphaAcidLowRange'][0].value;
			  	}
			  if(typeof hopGraph[key][mb.baseURI + 'hasAlphaAcidHighRange'] !== 'undefined') {
				hopsArray[j].aahigh = hopGraph[key][mb.baseURI + 'hasAlphaAcidHighRange'][0].value
				}

		      if(typeof hopGraph[key][mb.baseURI + 'flavourDescription'] !== 'undefined') {
			  	console.log(hopGraph[key][mb.baseURI + 'flavourDescription'][0].value);
	 		  	hopsArray[j].flavourdescription = hopGraph[key][mb.baseURI + 'flavourDescription'][0].value;
	 		  }
	 	      if(typeof hopGraph[key][mb.baseURI + 'hasFlavour'] !== 'undefined') {
	 	        for (var i = hopGraph[key][mb.baseURI + 'hasFlavour'].length - 1; i >= 0; i--) {
	 	        	hopsArray[j].flavour.push(hopGraph[key][mb.baseURI + 'hasFlavour'][i].value);
	 	        }
	 	      }
	  	      if(typeof hopGraph[key][mb.baseURI + 'possibleSubstitutions'] !== 'undefined') {
	 	         for (var i = hopGraph[key][mb.baseURI + 'possibleSubstitutions'].length - 1; i >= 0; i--) {
	 		       hopsArray[j].substitutions.push(hopGraph[key][mb.baseURI + 'possibleSubstitutions'][i].value);
	 		     }
	          }
	      	j++
	        }
        }
       callback();
    },
    two: function (callback) {
    	console.log(hopsArray.length);
	    origin.getOrigins(function (err, originJson) {
			if (err) {
				console.log('ERROR');
				callback(err);
			} else {
			for (var h = 0; h < hopsArray.length; h++) {
				for (var i = originJson.origins.length - 1; i >= 0; i--) {
					//console.log(originJson.origins[i].href + ' = ' + hopsArray[k].links.originid);
					//console.log(originJson.origins[i].href === hopsArray[k].links.originid);
				  if(typeof originJson.origins !== 'undefined' && originJson.origins[i].href === hopsArray[h].links.originid) {
					hopsArray[h].origin = originJson.origins[i].name;
				}
			};
			}
			}
	callback();
		});
	},
	tree : function(callback) {
		var	select = ' SELECT DISTINCT ?recommendeduses ?label ';
		select +=    ' WHERE { ?hop mb:recommendedUsage ?recommendeduses . ?recommendeduses rdfs:label ?label . }';
		console.log(prefix + select);
		ts.select(prefix + select, function(error, result) {
			if(error) {
				callback(error);
			} else {
			for(h = 0; h < hopsArray.length; h ++) {
				for(i = 0; i < result.results.bindings.length; i++) {
				if(result.results.bindings[i].recommendeduses.value === hopsArray[h].links.recommendedusageid) {
					hopsArray[h].recommendedusage = result.results.bindings[i].label.value;
				  }
			    }
			  }
			}
		callback();
		});
	}
}, function(err){
	if(err) {
		callback(err)
	} else {
	callback(null, hopsArray);
	}
});
}

var getHops = function (callback) {
    ts.graph('<' + mb.baseURI + 'HopsGraph>', function (err, hopGraph) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        apiFormattingHops(hopGraph, function (error, result) {
      			if(error) {
      				callback(error)
      			} else {
      			 var apiJson = {
      				 'meta': {
          			 'size': result.length
				        },
				      'links': {
				         'hops.maltster': {
				            'href': 'http://api.microbrew.it/hops/recommendeduses/:recommendeduseid',
				            'type': 'recommendedUses'
				          },
				     'hops.origin': {
				            'href': 'http://api.microbrew.it/origin/:originid',
				            'type': 'origin'
				          }
				        }
				      };
				   apiJson.hops =result
      				callback(null, apiJson);
      			}
      		});
    	//callback(null, hopGraph);
      }
    });
  };

var getHop = function (hopID, callback) {
	var apiHop = {
			'meta': {
			'size':	1
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
					apiHop.hops.push(res.hops[i]);
					callback(null, apiHop);
				}
			};
		}
	});
  } else {
  	console.log('ERROR');
  	callback(null, 'Not a Hops');
  }
};





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
	hardUpdateHop(hop,function (err, res) {
		if(err) {
			callback(err);
		} else {
			callback(null,res);
		}
	})
	// var hopURI = '<' + mb.baseURI + hop.name + '>',
	// 	hopID = util.createID();
	// 	ask = ' ASK { ?hop rdf:type ' + mb.hops + '; rdfs:label "' + hop.name + '" }',
	// 	ts.ask(ask, function (err, result) {
	// 		if(err) {
	// 			console.log(err);
	// 			callback(err);
	// 		} else {
	// 		console.log(typeof result + result);
	// 		if(result === false) {
	// 		var insert =	' INSERT DATA { ' + hopURI + ' rdf:type ' + mb.hops + '; ' + mb.hasID + ' ' + hopID + ' ;';
	// 			insert +=	' rdfs:label "' + hop.name + '"; ' + mb.aalow + ' ' + hop.aalow + '; ';
	// 			if(mb.origin.length < 0) {
	// 			insert +=	mb.flavorDescription + ' "' + hop.flavor + '" ;';
	// 			}
	// 			if(mb.origin.indexOf(mb.baseURI) === -1) {
	// 				insert += mb.origin + ' ' + mb.originuri;
	// 			}
	// 			insert +=	' } '
	// 			console.log(insert);
	// 		ts.insert(insert, function (error, insertResult) {
	// 			if(err) {
	// 				console.log(error);
	// 				callback(error);
	// 			} else {
	// 				callback(null, insertResult);
	// 			}
	// 		});
	// 		} else {
	// 			console.log("softUpdateHop");
	// 			softUpdateHop(hop);
	// 		}
	// 	}
	// 	});
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

var hardUpdateHop = function (hop, callback) {
var	hopID = util.createID(),
    update,
    insert,
    where,
    del =  ' DELETE { GRAPH mb:HopsGraph { ';
	del += ' ?hop mb:hasID ?id; rdfs:label ?label; mb:hasAlphaAcidLowRange ?aalow; mb:hasAlphaAcidHighRange ?aahigh; ' ;
	del += ' mb:possibleSubstitutions ?substitutions; mb:flavourDescription ?flavourdescription; ';
	del += ' mb:origin ?origin; mb:flavour ?flavour; mb:recommendedUsage ?recommendeduses }} ';
	insert = ' INSERT { GRAPH mb:HopsGraph {?hop mb:hasID ' + hopID + ';';
	insert += ' rdfs:label "' + hop.name + '"; mb:hasAlphaAcidLowRange ' + hop.aalow + ';';
	insert += ' mb:hasAlphaAcidHighRange ' + hop.aahigh + ';';
	insert += ' mb:origin ' + hop.origin + '; ';
	insert += ' mb:recommendedUsage ' + hop.recommendedusageid + ';'
	if(typeof hop.flavourdescription !== 'undefined') {
		insert += ' mb:flavourDescription "' + hop.flavourdescription + '"; ';
	}
	if(typeof hop.substitutions !== 'undefined') {
		for(i = 0; i < hop.substitutions.length; i++) {
			insert += 'mb:possibleSubstitutions ' + hop.substitutions[i] + '; ';
		}
	}
	if(typeof hop.flavour !== 'undefined') {
		for(i = 0; i < hop.flavour.length; i++) {
			insert += 'mb:hasFlavour "' + hop.flavour[i] + '"; ';
		}
	}
	insert += '}}';
	where = ' WHERE { GRAPH mb:HopsGraph { ';
	where += ' ?hop rdfs:label "' + hop.name + '"@en; rdf:type mb:Hops . ';
	where += ' OPTIONAL {?hop mb:hasID ?id} .';
	where += ' OPTIONAL {?hop mb:hasAlphaAcidLowRange ?aalow } .';
	where += ' OPTIONAL { ?hop mb:hasAlphaAcidHighRange ?aahigh} . ';
	where += ' OPTIONAL {?hop mb:possibleSubstitutions ?substitutions } .';
	where += ' OPTIONAL {?hop mb:flavourDescription ?flavourdescription } . ';
	where += ' OPTIONAL {?hop mb:origin ?origin } .';
	where += ' OPTIONAL {?hop mb:flavour ?flavour } .';
	where += ' OPTIONAL {?hop mb:recommendedUsage ?recommendeduses } . ';
	where += '  }}'

	update = prefix + del + insert + where;
	console.log(update);
	ts.insert(update, function (error, result) {
		if(error) {
			callback(error)
		} else {
			callback(null,result);
		}
	});
}

exports = module.exports = {
    'getHops': getHops,
    'getHop' : getHop,
    'updateHop': updateHop
};
