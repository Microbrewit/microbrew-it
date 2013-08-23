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
		console.log('getExtracts');
	async.parallel({
		liquidyeasts : function (callback) {
			getLiquidYeast( function(error, result) {
				if(error) {
					callback(error);
				} else {
					callback(null,result);
				}
			});
		},
		dryyeasts : function (callback) {
			getDryYeast( function(error, result) {
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
};

var getLiquidYeast = function (liquidID, callback) {
	var apiLiquid = {
			'meta': {
			'size':	1
			},
			'links': {
				'fermentables.maltster': {
					'href': 'http://api.microbrew.it/supplier/:supplierid',
					'type': 'recommendedUses'
				},
				'fermentables.origin': {
					'href': 'http://api.microbrew.it/origin/:originid',
					'type': 'origin'
				},

			},
			'liquidyeasts' :[]
		};

	getLiquidYeasts(function (err, res) {
		if(err) {
			callback(err);
		} else {
			for (var i = res.length - 1; i >= 0; i--) {
				if(res[i].id === liquidID) {
					apiLiquid.liquidyeasts.push(res[i]);
					}
		}
		if(apiLiquid.liquidyeasts.length === 0) {
			callback(null, {'error': {
								'message' : 'Not a liquid yeast.',
								'code': 234567
							}
						});
		} else {
		callback(null, apiLiquid);
		}
	}
	});

};

var getDryYeast = function (dryID, callback) {
	var apiDry = {
			'meta': {
			'size':	1
			},
			'links': {
				'fermentables.maltster': {
					'href': 'http://api.microbrew.it/supplier/:supplierid',
					'type': 'recommendedUses'
				},
				'fermentables.origin': {
					'href': 'http://api.microbrew.it/origin/:originid',
					'type': 'origin'
				},

			},
			'dryyeasts' :[]
		};

	getDryYeasts(function (err, res) {
		if(err) {
			callback(err);
		} else {
			for (var i = res.length - 1; i >= 0; i--) {
				if(res[i].id === dryID) {
					apiDry.dryyeasts.push(res[i]);
					}
		}
		if(apiDry.dryyeasts.length === 0) {
			callback(null, {'error': {
								'message' : 'Not a dry yeast.',
								'code': 234568
							}
						});
		} else {
		callback(null, apiDry);
		}
	}
	});

};

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
};

exports = module.exports = {
    'getYeasts': getYeasts,
    'getYeast': getYeast,
    'getLiquidYeasts': getLiquidYeasts,
    'getLiquidYeast': getLiquidYeast,
    'getDryYeasts': getDryYeasts,
    'getDryYeast': getDryYeast,
};
