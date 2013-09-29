var config = require('../config'),
	mb = require('../ontology').mb,
	ts = require('../triplestore'),
	prefix = require('../ontology').prefix,
	origin = require('../origin'),
	async = require('async');

//Gets all fermentables from the triplestore
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

var getFermentableURI = function(fermID, callback) {
	if(typeof fermID === 'object' ) {
		fermID = fermID.value;
	}
	getFermentable(fermID, function (error, fermentable){
		if(error) {
			callback(error);
		} else {
			for(key in fermentable) {
				if(key === 'grains') {
					callback(null, fermentable[key][0]);

						}
					}
				}
	});
};

var getFermentable = function (fermID, callback) {

	async.parallel({
		extract : function (callback) {
			getExtract(fermID, function(err, result) {
				if(err) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		grain : function (callback) {
			getGrain(fermID, function(err, result) {
				if(err) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		sugar : function (callback) {
			getSugar(fermID, function(err, result) {
				if(err) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
	}, function (err, res) {
		if(typeof res.extract.error === 'undefined') {
		callback(null,res.extract);
		} else if (typeof res.grain.error === 'undefined') {
		callback(null,res.grain);
		} else if (typeof res.sugar.error === 'undefined') {
		callback(null,res.sugar);
		} else {
			callback(null, {'error': {
								'message' : 'Not a fermentalbe.',
								'code': 234531
							}
						});
		}
	});
};

var apiFormattingFermentables = function (fermentableGraph, callback) {
	var fermentablesArray = [],
	j = 0;
	async.series({
		one : function(callback) {
			for(key in fermentableGraph) {
				fermentablesArray.push({
				'id' : fermentableGraph[key][mb.baseURI + 'hasID'][0].value,
				'href': key,
				'name': fermentableGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value,
				'colour' : fermentableGraph[key][mb.baseURI + 'hasColour'][0].value,
				'ppg': fermentableGraph[key][mb.baseURI + 'hasPPG'][0].value,
				});
				if(typeof fermentableGraph[key][mb.baseURI + 'suppliedBy'] !== 'undefined') {
					fermentablesArray[j].suppliedbyid = fermentableGraph[key][mb.baseURI + 'suppliedBy'][0].value;
				}
				if(typeof fermentableGraph[key][mb.baseURI + 'origin'] !== 'undefined') {
					fermentablesArray[j].originid = fermentableGraph[key][mb.baseURI + 'origin'][0].value;
				}
				j++;
			}
			callback();
		},
		two : function (callback) {
			origin.getSuppliers(function (err,suppliers) {
						if(err) {
							callback(err);
						} else {
							for (var i = fermentablesArray.length - 1; i >= 0; i--) {
								if(typeof fermentablesArray[i].suppliedbyid !== 'undefined') {

									for (var h = suppliers.suppliers.length - 1; h >= 0; h--) {
										if(suppliers.suppliers[h].href === fermentablesArray[i].suppliedbyid) {
											fermentablesArray[i].suppliedby = suppliers.suppliers[h].name;
										}
										if(typeof fermentablesArray[i].origin === 'undefined' && suppliers.suppliers.locatedin !== 'undefined') {
											fermentablesArray[i].origin = suppliers.suppliers[h].locatedin;
										}
									}
								}
							}
						}
					callback();
					});
		},
	},function(err){
		if(err){
			callback(err);
		} else {
			callback(null,fermentablesArray);
		}
	});
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
				if(res[i].id === grainID || res[i].href === grainID) {
					apiGrain.grains.push(res[i]);
			}
		}
		if(apiGrain.grains.length === 0) {
			callback(null,  {'error': {
								'message' : 'Not a dry  extract.',
								'code': 234531
							}
						});
		} else {
		callback(null, apiGrain);
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
			callback(null,  {'error': {
								'message' : 'Not a sugar.',
								'code': 234531
							}
						});
		} else {
		callback(null, apiSugar);
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
			callback(null, {'error': {
								'message' : 'Not a dry  extract.',
								'code': 234531
							}
						});
		} else {
		callback(null, apiDry);
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
			callback(null, {'error': {
								'message' : 'Not a liquid extract.',
								'code': 234530
							}
						});
		} else {
		callback(null, apiLiquid);
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
	async.parallel({
		liquidextracts : function (callback) {
			getLiquidExtracts( function(error, result) {
				if(error) {
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
				} else {
					callback(null,result);
				}
			});
		},
	}, function (err, res) {
		callback(null,res);
	});
};

var getExtract = function (extractID, callback) {
	async.parallel({
		liquidextract : function (callback) {
			getLiquidExtract(extractID, function(err, result) {
				if(err) {
					callback(err);
				} else {
					callback(null,result);
				}
			});
		},
		dryextract : function (callback) {
			getDryExtract(extractID, function(err, result) {
				if(err) {
					callback(err);
				} else {
					callback(null,result);
				}
			});
		},
	}, function (err, res) {
		if(typeof res.liquidextract.error === 'undefined') {
		callback(null,res.liquidextract);
		} else if (typeof res.dryextract.error === 'undefined') {
			callback(null,res.dryextract);
		} else {
			callback(null, {'error': {
								'message' : 'Not a extract.',
								'code': 234100
							}
						});
		}
	});
};

exports = module.exports = {
    'getFermentables': getFermentables,
    'getFermentable': getFermentable,
    'getFermentableURI': getFermentableURI,
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
