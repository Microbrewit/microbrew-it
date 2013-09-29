'use strict';

var mb = require('../ontology').mb,
	prefix = require ('../ontology').prefix,
	util = require('../util'),
	async = require('async'),
	fermentables = require('../ingredients').fermentables,
	hops = require('../ingredients').hops,
	ingredients = require('../ingredients'),
	ts = require('../triplestore');

var addRecipe = function(recipeJSON, callback) {
	createInsertQuery(recipeJSON, function (err, query) {
		if(err) {
			callback(err);
		} else {
			console.log(query);
			ts.insert(query, function (error, result) {
				if(error) {
					console.log('error: ' + error);
					callback(error);
				} else {
					callback(null,result);
				}
			});
		}
	});
};

var createInsertQuery = function(recipeJSON, callback) {
	var recipeID = util.createID(),
	recipeURI = '<' + mb.recipeURI + recipeID + '>',
	insert = '',
	mash = '',
	steps = '',
	boil = '',
	ferm = '',
	where = '';
	console.log(recipeID);
	insert += 'INSERT { GRAPH ' + recipeURI + ' { ';
	insert += recipeURI + ' rdf:type mb:Recipe ; rdf:type owl:NamedIndividual ; mb:brewedBy <' + recipeJSON.brewer[0].href + '> ; ';
	insert += ' mb:recipeName "' + recipeJSON.recipename + '" ; ';
	insert += ' mb:recipeStyle "' + recipeJSON.recipestyle + '" ; ';

	if(typeof recipeJSON.notes !== 'undefined' && recipeJSON.notes.length > 0) {
		insert += 'mb:notes "' + recipeJSON.notes + '" ; ';
	}

	//MashStep
	for (var m = recipeJSON.mashSteps.length - 1; m >= 0; m--) {
		var mashID = util.createID(),
		mashURI = '<' + mb.mashURI + mashID + '> ';
		steps += ' mb:hasMashStep ' + mashURI + ' . ';
		mash += ' GRAPH ' + mashURI + ' { ' + mashURI + ' rdf:type <' + recipeJSON.mashSteps[m].type + '> ; mb:isStep ' + recipeJSON.mashSteps[m].number + ' ; ';
		mash += ' mb:stepLength ' + recipeJSON.mashSteps[m].length + ' ; ' + ' mb:volume ' + recipeJSON.mashSteps[m].volume + ' ; ';
		mash += ' mb:stepTemperature ' + recipeJSON.mashSteps[m].temperature + ' . ';
		if(typeof recipeJSON.mashSteps[m].yeasts !== 'undefined') {

			for (var y = recipeJSON.mashSteps[m].yeasts.length - 1; y >= 0; y--) {
				mash += mashURI + ' mb:hasYeast <' + recipeJSON.mashSteps[m].yeasts[y].href  + '> . ';
				mash += '<' + recipeJSON.mashSteps[m].yeasts[y].href + '> mb:amount ' + recipeJSON.mashSteps[m].yeasts[y].amount + ' . ';
				}
			}

		if(typeof recipeJSON.mashSteps[m].fermentables !== 'undefined') {
			for (var f = recipeJSON.mashSteps[m].fermentables.length - 1; f >= 0; f--) {
				mash += mashURI + ' mb:hasFermentable <' + recipeJSON.mashSteps[m].fermentables[f].href  + '> . ';
				mash += '<' + recipeJSON.mashSteps[m].fermentables[f].href + '> mb:amount ' + recipeJSON.mashSteps[m].fermentables[f].amount + ' . ';
				}
			}

		if(typeof recipeJSON.mashSteps[m].hops !== 'undefined') {
			for (var h = recipeJSON.mashSteps[m].hops.length - 1; h >= 0; h--) {
				mash += mashURI + ' mb:hasHops <' + recipeJSON.mashSteps[m].hops[h].href  + '> . ';
				mash += '<' + recipeJSON.mashSteps[m].hops[h].href + '> mb:amount ' + recipeJSON.mashSteps[m].hops[h].amount + ' ; ';
				mash += 'mb:hasAlphaAcidLowRange ' + recipeJSON.mashSteps[m].hops[h].aalow + ' . ';
				}
			}
		if(typeof recipeJSON.mashSteps[m].spices !== 'undefined') {
			for (var s = recipeJSON.mashSteps[m].spices.length - 1; s >= 0; s--) {
				mash += mashURI + ' mb:hasSpice <' + recipeJSON.mashSteps[m].spices[s].href  + '> . ';
				mash += '<' + recipeJSON.mashSteps[m].spices[s].href + '> mb:amount ' + recipeJSON.mashSteps[m].spices[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.mashSteps[m].notes !== 'undefined' && recipeJSON.mashSteps[m].notes.length > 0) {
			mash += mashURI + ' mb:notes "' + recipeJSON.mashSteps[m].notes + '" . ';
		}
		mash += ' }'
	}
	//Boil steps
	for (var b = recipeJSON.boilSteps.length - 1; b >= 0; b--) {
		var boilID = util.createID(),
		boilURI = '<' + mb.boilURI + boilID + '>';

		steps += recipeURI + ' mb:hasBoilStep ' + boilURI + ' . ';
		boil += ' GRAPH ' + boilURI + ' { ' + boilURI + ' rdf:type mb:BoilStep ; mb:isStep ' + recipeJSON.boilSteps[b].number + ' ; ';
		boil += ' mb:stepLength ' + recipeJSON.boilSteps[b].length + ' ; ';
		boil += ' mb:volume ' + recipeJSON.boilSteps[b].volume + ' . ';

		if(typeof recipeJSON.boilSteps[b].yeasts !== 'undefined') {
			for (var y = recipeJSON.boilSteps[b].yeasts.length - 1; y >= 0; y--) {
				boil += mashURI + ' mb:hasYeast <' + recipeJSON.boilSteps[b].yeasts[y].href  + '> . ';
				boil += '<' + recipeJSON.boilSteps[b].yeasts[y].href + '> mb:amount ' + recipeJSON.boilSteps[b].yeasts[y].amount + ' . ';
				}
			}

		if(typeof recipeJSON.boilSteps[b].fermentables !== 'undefined') {
			for (var f = recipeJSON.boilSteps[b].fermentables.length - 1; f >= 0; f--) {
				boil += boilURI + ' mb:hasFermentable <' + recipeJSON.boilSteps[b].fermentables[f].href  + '> . ';
				boil += '<' + recipeJSON.boilSteps[b].fermentables[f].href + '> mb:amount ' + recipeJSON.boilSteps[b].fermentables[f].amount + ' . ';
				}
			}
		if(typeof recipeJSON.boilSteps[b].hops !== 'undefined') {
			for (var h = recipeJSON.boilSteps[b].hops.length - 1; h >= 0; h--) {
				boil += boilURI + ' mb:hasHops <' + recipeJSON.boilSteps[b].hops[h].href  + '> . ';
				boil += '<' + recipeJSON.boilSteps[b].hops[h].href + '> mb:amount ' + recipeJSON.boilSteps[b].hops[h].amount + ' ; ';
				boil += 'mb:hasAlphaAcidLowRange ' + recipeJSON.boilSteps[b].hops[h].aalow + ' . ';
				}
			}
		if(typeof recipeJSON.boilSteps[b].spices !== 'undefined') {
			for (var s = recipeJSON.boilSteps[b].spices.length - 1; s >= 0; s--) {
				boil += boilURI + ' mb:hasSpice <' + recipeJSON.boilSteps[b].spices[s].href  + '> . ';
				boil += '<' + recipeJSON.boilSteps[b].spices[s].href + '> mb:amount ' + recipeJSON.boilSteps[b].spices[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.boilSteps[b].fruits !== 'undefined') {
			for (var s = recipeJSON.boilSteps[b].fruits.length - 1; s >= 0; s--) {
				boil += boilURI + ' mb:hasFruit <' + recipeJSON.boilSteps[b].fruits[s].href  + '> . ';
				boil += '<' + recipeJSON.boilSteps[b].fruits[s].href + '> mb:amount ' + recipeJSON.boilSteps[b].fruits[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.boilSteps[b].notes !== 'undefined' && recipeJSON.boilSteps[b].notes.length > 0) {
			boil += fermURI + ' mb:notes "' + recipeJSON.boilSteps[b].notes + '" . ';
		}
		boil += ' }';
	}

	//Fermentation step
	for (var k = recipeJSON.fermentationSteps.length - 1; k >= 0; k--) {
		var fermID = util.createID(),
		fermURI = '<' + mb.fermURI + fermID + '>';

		steps += recipeURI + ' mb:hasFermentationStep ' + fermURI + ' . ';
		ferm += ' GRAPH' + fermURI + ' { ' + fermURI + ' rdf:type <' + recipeJSON.fermentationSteps[k].type + '> ; mb:isStep ' + recipeJSON.fermentationSteps[k].number + ' ; ';
		ferm += ' mb:stepLength ' + recipeJSON.fermentationSteps[k].length + ' ; ';
		ferm += ' mb:stepTemperature ' + recipeJSON.fermentationSteps[k].temperature + ' . ';

		if(typeof recipeJSON.fermentationSteps[k].volume !== 'undefined') {
		ferm += fermURI + ' mb:volume ' + recipeJSON.fermentationSteps[k].volume + ' . ';
		}

		if(typeof recipeJSON.fermentationSteps[k].yeasts !== 'undefined') {
			for (var y = recipeJSON.fermentationSteps[k].yeasts.length - 1; y >= 0; y--) {
				ferm += fermURI + ' mb:hasYeast <' + recipeJSON.fermentationSteps[k].yeasts[y].href  + '> . ';
				ferm += '<' + recipeJSON.fermentationSteps[k].yeasts[y].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].yeasts[y].amount + ' . ';
				}
			}

		if(typeof recipeJSON.fermentationSteps[k].fermentables !== 'undefined') {
			for (var f = recipeJSON.fermentationSteps[k].fermentables.length - 1; f >= 0; f--) {
				ferm += fermURI + ' mb:hasFermentable <' + recipeJSON.fermentationSteps[k].fermentables[f].href  + '> . ';
				ferm += '<' + recipeJSON.fermentationSteps[k].fermentables[f].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].fermentables[f].amount + ' . ';
				}
			}
		if(typeof recipeJSON.fermentationSteps[k].hops !== 'undefined') {
			for (var h = recipeJSON.fermentationSteps[k].hops.length - 1; h >= 0; h--) {
				ferm += fermURI + ' mb:hasHops <' + recipeJSON.fermentationSteps[k].hops[h].href  + '> . ';
				ferm += '<' + recipeJSON.fermentationSteps[k].hops[h].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].hops[h].amount + ' ; ';
				ferm += 'mb:hasAlphaAcidLowRange ' + recipeJSON.fermentationSteps[k].hops[h].aalow + ' . ';
				}
			}
		if(typeof recipeJSON.fermentationSteps[k].spices !== 'undefined') {
			for (var s = recipeJSON.fermentationSteps[k].spices.length - 1; s >= 0; s--) {
				ferm += fermURI + ' mb:hasSpice <' + recipeJSON.fermentationSteps[k].spices[s].href  + '> . ';
				ferm += '<' + recipeJSON.fermentationSteps[k].spices[s].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].spices[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.fermentationSteps[k].fruits !== 'undefined') {
			for (var s = recipeJSON.fermentationSteps[k].fruits.length - 1; s >= 0; s--) {
				ferm += fermURI + ' mb:hasFruit <' + recipeJSON.fermentationSteps[k].fruits[s].href  + '> . ';
				ferm += '<' + recipeJSON.fermentationSteps[k].fruits[s].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].fruits[s].amount + ' . ';
				}
			}

		if(typeof recipeJSON.fermentationSteps[k].notes !== 'undefined' && recipeJSON.fermentationSteps[k].notes.length > 0) {
			ferm += fermURI + ' mb:notes "' + recipeJSON.fermentationSteps[k].notes + '" . ';
		}
		 	ferm += ' }';
		if(typeof recipeJSON.botteling !== 'undefined') {
			// for (var b = recipeJSON.botteling.length - 1; b >= 0; b--) {

			// 	}
		}
	}

	where += ' } WHERE { <' + recipeJSON.brewer[0].href + '> mb:hasID "' + recipeJSON.brewer[0].id +'" }';

	callback(null, prefix + insert + steps + ' }' + mash + boil + ferm + where);
};

var getRecipe = function(id, callback) {
	var recipeURI = '<' + mb.recipeURI + id + '>';
		ts.graph(recipeURI, function(error, recipeGraph) {
			if(error){
				callback(error);
			} else {
				apiRecipeJson(recipeGraph, function(err, apiJson){
					if(err) {
						callback(err);
					} else {
						callback(null,apiJson);
					}
				});
				//callback(null,recipeGraph);
			}
		});
};

var apiRecipeJson = function(recipe, callback) {
		var apiJson = {
			'recipename': '',
			'recipestyle': '',
			'brewer':[],
			'mashSteps': [],
			'boilSteps': [],
			'fermentationSteps': [],

		};
		//console.log(apiJson);

	async.series({
		meta: function (callback) {
			for(var key in recipe) {
				if(key.indexOf(mb.recipeURI) !== -1) {
					apiJson.recipename = recipe[key][mb.baseURI + 'recipeName'][0].value;
					apiJson.recipestyle = recipe[key][mb.baseURI + 'recipeStyle'][0].value;
					for (var i = recipe[key][mb.baseURI + 'brewedBy'].length - 1; i >= 0; i--) {
						apiJson.brewer.push({'href': recipe[key][mb.baseURI + 'brewedBy'][i].value})
					};

				}
			}
			console.log('callback meta');
			callback();
		},

		mashSteps: function (callback) {
			console.log('mashsteps');
			for(var key in recipe) {
			getMashSteps(recipe[key], function (error, mashSteps) {
				if(error) {
					callback(error)
				} else {
				//console.log('mashSteps: ' + JSON.stringify(mashSteps)
				apiJson.mashSteps = mashSteps;
				callback();
				}
			});
			}
		},

		boilSteps: function (callback) {
			console.log('boilsteps');
			for(var key in recipe) {
			getBoilSteps(recipe[key], function (error,boilSteps) {
				if(error) {
					callback(error)
				} else {
				apiJson.boilSteps = boilSteps;
				callback();
				}
			});
			}
		},
		fermentationSteps: function (callback) {
			console.log('fermentationSteps');
			for(var key in recipe) {
			getFermentationSteps(recipe[key], function (error,fermentationSteps) {
				if(error) {
					callback(error)
				} else {
				apiJson.fermentationSteps = fermentationSteps;
				callback();
				}
			});
			}
		}

	}, function(error,steps) {
		if(error) {
			callback(error);
		} else {
			callback(null,apiJson);
		}
	});
};

var getMashSteps = function (recipe, callback) {
		async.map(recipe[mb.baseURI + 'hasMashStep'] , function (mashStep, callback) {
				ts.graph('<' + mashStep.value + '>', function (error, mashStepGraph) {
						if(error) {
							callback(error);
						} else {
							getStep(mashStepGraph, function (error, mashStep) {
								if(error) {
									callback(error)
								} else {
									callback(null, mashStep);
								}
							});
						}
					});

			},  function (error, result) {
				if(error) {
					callback(err)
				} else {
					console.log(result)
					callback(null, result);
				}
			});
};

var getBoilSteps = function (recipe, callback) {
		console.log('getBoilSteps');
		async.map(recipe[mb.baseURI + 'hasBoilStep'] , function (boilStep, callback) {
				ts.graph('<' + boilStep.value + '>', function (error, boilStepGraph) {
						if(error) {
							callback(error);
						} else {
							getStep(boilStepGraph, function (error, boilStep) {
								if(error) {
									callback(error)
								} else {
									//console.log('boilStep: ' + JSON.stringify(mashStep))
									callback(null, boilStep);
								}
							});
						}
					});

			},  function (error, result) {
				if(error) {
					callback(err)
				} else {
					console.log('result boilStep: ' + result)
					callback(null, result);
				}
			});
};
var getFermentationSteps = function (recipe, callback) {
		console.log('getFermentationSteps');
		async.map(recipe[mb.baseURI + 'hasFermentationStep'] , function (fermantationStep, callback) {
				ts.graph('<' + fermantationStep.value + '>', function (error, fermantationStepGraph) {
						if(error) {
							callback(error);
						} else {
							getStep(fermantationStepGraph, function (error, fermentationStep) {
								if(error) {
									callback(error)
								} else {
									//console.log('boilStep: ' + JSON.stringify(mashStep))
									callback(null, fermentationStep);
								}
							});
						}
					});

			},  function (error, result) {
				if(error) {
					callback(err)
				} else {
					console.log('result boilStep: ' + result)
					callback(null, result);
				}
			});
};
var getStep = function (stepGraph, callback) {
		var step;

		async.series({
			meta : function(callback) {
				for(var key in stepGraph) {
			if(typeof stepGraph[key][mb.baseURI + 'isStep'] !== 'undefined') {
				var meta = {
					'number': stepGraph[key][mb.baseURI + 'isStep'][0].value,
					'href': key,
					'type': stepGraph[key]['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].value,
					'length': stepGraph[key][mb.baseURI + 'stepLength'][0].value,
					'fermentables' : [],
					'hops' : [],
					'yeasts': [],
					'fruits': [],
					'spices': [],
					};
				if(typeof stepGraph[key][mb.baseURI + 'volume'] !== 'undefined') {
					meta.volume = stepGraph[key][mb.baseURI + 'volume'][0].value;
				}
				if(typeof stepGraph[key][mb.baseURI + 'stepTemperature'] !== 'undefined') {
				meta.temperature = stepGraph[key][mb.baseURI + 'stepTemperature'][0].value;
					}
			callback(null, meta);
				}
			}
				},			//adds fermentables href to mash step
			fermentables : function(callback) {
					for(var key in stepGraph) {
			if(typeof stepGraph[key][mb.baseURI + 'isStep'] !== 'undefined') {
				if(typeof stepGraph[key][mb.baseURI + 'hasFermentable'] !== 'undefined') {
						console.log('hasFermentable');
							async.map(stepGraph[key][mb.baseURI + 'hasFermentable'], function (ferm, callback) {
								fermentables.getFermentableURI(ferm.value, function (error, fermentable) {
									if(error) {
										callback(error);
									} else {
										var amount = stepGraph[fermentable.href][mb.baseURI + 'amount'][0].value;
										fermentable.amount = amount;
										callback(null,fermentable);
									}
									});
								}, function(error, res) {
									if(error) {
										callback(error);
									} else {
										callback(null,res);
									}
								});
							} else {
								callback()
							}
						}
					}
						},

			hops : function(callback) {
					for(var key in stepGraph) {
			if(typeof stepGraph[key][mb.baseURI + 'isStep'] !== 'undefined') {
				if(typeof stepGraph[key][mb.baseURI + 'hasHops'] !== 'undefined') {
							async.map(stepGraph[key][mb.baseURI + 'hasHops'], function (hop, callback) {
								console.log('hop.value: ' + hop.value);
								hops.getHopURI(hop.value, function (error, hopResult) {
									if(error) {
										callback(error);
									} else {
										var amount = stepGraph[hopResult.href][mb.baseURI + 'amount'][0].value;
										hopResult.amount = amount;
										callback(null, hopResult);
									}
									});
								}, function(err, res) {
									callback(null, res);
								});
							} else {
								callback()
							}
						}
					}
						},
			yeasts : function(callback) {
				for(var key in stepGraph) {
					if(typeof stepGraph[key][mb.baseURI + 'isStep'] !== 'undefined') {
						console.log('Yeasts ' + key);
						console.log(stepGraph);
						if(typeof stepGraph[key][mb.baseURI + 'hasYeast'] !== 'undefined') {
							console.log('hasYeast');
								async.map(stepGraph[key][mb.baseURI + 'hasYeast'], function (yeast, callback) {
									ingredients.yeasts.getYeastURI(yeast.value, function (error, yeastResult) {
										if(error) {
											callback(error);
										} else {
											//console.log(hopResult);
											var amount = stepGraph[yeastResult.href][mb.baseURI + 'amount'][0].value;
											console.log('amount: ' + amount);
											yeastResult.amount = amount;
											callback(null, yeastResult);
										}
									});
								}, function(err, res) {
									callback(null, res);
								});
							} else {
								console.log('yeasts else callback');
								callback()
							}
						}
					}
						},
	}, function(error, result) {
		if(error) {
			callback(error);
		} else {
			step = result.meta;
			step.fermentables = result.fermentables;
			step.hops = result.hops;
			step.yeasts = result.yeasts;
		callback(null, step);
		}
	});
},

exports = module.exports = {
	'addRecipe': addRecipe,
	'getRecipe': getRecipe

};
