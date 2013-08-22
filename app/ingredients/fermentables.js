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
	}, function (error, result) {
		if(error) {
			callback(error);
		} else {
		var apiJson = {
        'meta': {
          'size': result.sugars.length + result.extracts.liquidextracts.length + result.extracts.dryextracts.length + result.grains.length
        },
        'links': {

          },
      };
      	apiJson.fermentables = result;
		callback(null, apiJson);
		}
	});
};

var getFermentable = function (fermID, callback) {
	async.parallel({
		extract : function (callback) {
			getExtract(fermID, function(error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		grain : function (callback) {
			getGrain(fermID, function(error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		sugar : function (callback) {
			getSugar(fermID, function(error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
	}, function (err, res) {
		if(res.extract.status) {
		callback(null,res.extract);
		} else if (res.grain.status) {
		callback(null,res.grain);
		} else if (res.sugar.status) {
		callback(null,res.sugar);
		} else {
			console.log('res');
			callback(null, {'status': false, 'message':'Not an fermentable'});
		}
	});
};

var apiFormattingFermentables = function (fermentableGraph, callback) {
	console.log(fermentableGraph);
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

var getGrain = function (grainID, callback) {
	var apiGrain = {
			'meta': {
			'size':	1
			},
			'links': {
				'fermentables.maltster': {
					'href': 'http://api.microbrew.it/maltsters/:maltsterid',
    				'type': 'recommendedUses'
				},
				'fermentables.origin': {
   					'href': 'http://api.microbrew.it/origin/:originid',
   					'type': 'origin'
  				},

			},
			'grains' :[
			]
		};

	getGrains(function (err, res) {
		if(err) {
			callback(err);
		} else {
			for (var i = res.length - 1; i >= 0; i--) {
				console.log('resID: ' + res[i].id + ' === ' + grainID);
				console.log(res[i].id === grainID);
				if(res[i].id === grainID) {
					apiGrain.grains.push(res[i]);
			}
		}
		if(apiGrain.grains.length === 0) {
			callback(null, {'message':'Not a grain.','status': false})
		} else {
		callback(null, {'status': true, 'result' : apiGrain});
		}
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

var getSugar = function (sugarID, callback) {
	var apiSugar = {
			'meta': {
			'size':	1
			},
			'links': {
				'fermentables.maltster': {
					'href': 'http://api.microbrew.it/maltsters/:maltsterid',
    				'type': 'recommendedUses'
				},
				'fermentables.origin': {
   					'href': 'http://api.microbrew.it/origin/:originid',
   					'type': 'origin'
  				},

			},
			'sugars' :[]
		};

	getSugars(function (err, res) {
		if(err) {
			callback(err);
		} else {
			for (var i = res.length - 1; i >= 0; i--) {
				if(res[i].id === sugarID) {
					apiSugar.sugars.push(res[i]);
					}
		}
		if(apiSugar.sugars.length === 0) {
			callback(null, {'message':'Not a sugar.','status': false})
		} else {
		callback(null, {'status': true, 'result' : apiSugar});
		}
	}
	});

};

var getDryExtracts = function (callback) {
	ts.graph('<' + mb.baseURI + 'Dry_Extract>', function (error, dryExtractGraph) {
		if(error) {
			callback(error);
		} else {
			apiFormattingFermentables(dryExtractGraph, function (err, apiJson){
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

var getDryExtract = function (dryID, callback) {
	var apiDry = {
			'meta': {
			'size':	1
			},
			'links': {
				'fermentables.maltster': {
					'href': 'http://api.microbrew.it/maltsters/:maltsterid',
    				'type': 'recommendedUses'
				},
				'fermentables.origin': {
   					'href': 'http://api.microbrew.it/origin/:originid',
   					'type': 'origin'
  				},

			},
			'dryextracts' :[]
		};

	getDryExtracts(function (err, res) {
		if(err) {
			callback(err);
		} else {
			for (var i = res.length - 1; i >= 0; i--) {
				if(res[i].id === dryID) {
					apiDry.dryextracts.push(res[i]);
					}
		}
		if(apiDry.dryextracts.length === 0) {
			callback(null, {'message':'Not a dry extract.','status': false})
		} else {
		callback(null, {'status': true, 'result' : apiDry});
		}
	}
	});

};

var getLiquidExtract = function (liquidID, callback) {
	var apiLiquid = {
			'meta': {
			'size':	1
			},
			'links': {
				'fermentables.maltster': {
					'href': 'http://api.microbrew.it/maltsters/:maltsterid',
    				'type': 'recommendedUses'
				},
				'fermentables.origin': {
   					'href': 'http://api.microbrew.it/origin/:originid',
   					'type': 'origin'
  				},

			},
			'liquidextracts' :[]
		};

	getLiquidExtracts(function (err, res) {
		if(err) {
			callback(err);
		} else {
			for (var i = res.length - 1; i >= 0; i--) {
				if(res[i].id === liquidID) {
					apiLiquid.liquidextracts.push(res[i]);
					}
		}
		if(apiLiquid.liquidextracts.length === 0) {
			callback(null, {'message': 'Not a liquid extract.', status: false})
		} else {
		callback(null, {'status': true, 'result' : apiLiquid});
		}
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
		liquidextracts : function (callback) {
			getLiquidExtracts( function(error, result) {
				if(error) {
					console.log('Liquid Error');
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		dryextracts : function (callback) {
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

var getExtract = function (extractID, callback) {
	async.parallel({
		liquidextract : function (callback) {
			getLiquidExtract(extractID, function(error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		dryextract : function (callback) {
			getDryExtract(extractID, function(error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
	}, function (err, res) {
		if(res.liquidextract.status) {
			console.log('liquidextract');
		callback(null,res.liquidextract);
		} else if (res.dryextract.status) {
			console.log('dryextract');
		callback(null,res.dryextract);
		} else {
			console.log('res');
			callback(null, 'Not an extract');
		}
	});
}

exports = module.exports = {
    'getFermentables': getFermentables,
    'getFermentable': getFermentable,
    'getGrains': getGrains,
    'getSugars': getSugars,
    'getSugar' : getSugar,
    'getDryExtracts' : getDryExtracts,
    'getDryExtract': getDryExtract,
    'getLiquidExtracts': getLiquidExtracts,
    'getLiquidExtract': getLiquidExtract,
    'getExtracts': getExtracts,
    'getExtract': getExtract,
    'getGrain': getGrain,
};
