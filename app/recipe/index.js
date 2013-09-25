'use strict';

var mb = require('../ontology').mb,
	prefix = require ('../ontology').prefix,
	util = require('../util'),
	async = require('async'),
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
	where = '';
	console.log(recipeID);
	insert += 'INSERT { GRAPH ' + recipeURI + ' { ';
	insert += recipeURI + ' rdf:type mb:Recipe ; rdf:type owl:NamedIndividual ; mb:brewedBy <' + recipeJSON.user[0].href + '> ; ';

	if(typeof recipeJSON.notes !== 'undefined' && recipeJSON.notes.length > 0) {
		insert += 'mb:notes "' + recipeJSON.notes + '" ; ';
	}
	//MashStep
	for (var m = recipeJSON.mashSteps.length - 1; m >= 0; m--) {
		var mashID = util.createID(),
		mashURI = '<' + mb.mashURI + mashID + '> ';
		insert += ' mb:hasMashStep ' + mashURI + ' . ';
		insert += ' <' + mb.mashURI + mashID + '> rdf:type <' + recipeJSON.mashSteps[m].type + '> ; mb:isStep ' + recipeJSON.mashSteps[m].number + ' ; ';
		insert += ' mb:stepLength ' + recipeJSON.mashSteps[m].length + ' ; ' + ' mb:volume ' + recipeJSON.mashSteps[m].volume + ' ; ';
		insert += ' mb:stepTemperature ' + recipeJSON.mashSteps[m].temperature + ' . ';
		if(typeof recipeJSON.mashSteps[m].fermentables !== 'undefined') {
			for (var f = recipeJSON.mashSteps[m].fermentables.length - 1; f >= 0; f--) {
				insert += mashURI + ' mb:hasFermentable <' + recipeJSON.mashSteps[m].fermentables[f].href  + '> . ';
				insert += '<' + recipeJSON.mashSteps[m].fermentables[f].href + '> mb:amount ' + recipeJSON.mashSteps[m].fermentables[f].amount + ' . ';
				}
			}
		if(typeof recipeJSON.mashSteps[m].hops !== 'undefined') {
			for (var h = recipeJSON.mashSteps[m].hops.length - 1; h >= 0; h--) {
				insert += mashURI + ' mb:hasHops <' + recipeJSON.mashSteps[m].hops[h].href  + '> . ';
				insert += '<' + recipeJSON.mashSteps[m].hops[h].href + '> mb:amount ' + recipeJSON.mashSteps[m].hops[h].amount + ' ; ';
				insert += 'mb:hasAlphaAcidLowRange ' + recipeJSON.mashSteps[m].hops[h].aalow + ' . ';
				}
			}
		if(typeof recipeJSON.mashSteps[m].spices !== 'undefined') {
			for (var s = recipeJSON.mashSteps[m].spices.length - 1; s >= 0; s--) {
				insert += mashURI + ' mb:hasSpice <' + recipeJSON.mashSteps[m].spices[s].href  + '> . ';
				insert += '<' + recipeJSON.mashSteps[m].spices[s].href + '> mb:amount ' + recipeJSON.mashSteps[m].spices[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.mashSteps[m].notes !== 'undefined' && recipeJSON.mashSteps[m].notes.length > 0) {
			insert += mashURI + ' mb:notes "' + recipeJSON.mashSteps[m].notes + '" . ';
		}
	}
	//Boil steps
	for (var b = recipeJSON.boilSteps.length - 1; b >= 0; b--) {
		var boilID = util.createID(),
		boilURI = '<' + mb.boilURI + boilID + '>';

		insert += recipeURI + ' mb:hasBoilStep ' + boilURI + ' . ';
		insert += boilURI + ' rdf:type mb:BoilStep ; mb:isStep ' + recipeJSON.boilSteps[b].number + ' ; ';
		insert += ' mb:stepLength ' + recipeJSON.boilSteps[b].length + ' ; ';
		insert += ' mb:volume ' + recipeJSON.boilSteps[b].volume + ' . ';

		if(typeof recipeJSON.boilSteps[b].fermentables !== 'undefined') {
			for (var f = recipeJSON.boilSteps[b].fermentables.length - 1; f >= 0; f--) {
				insert += boilURI + ' mb:hasFermentable <' + recipeJSON.boilSteps[b].fermentables[f].href  + '> . ';
				insert += '<' + recipeJSON.boilSteps[b].fermentables[f].href + '> mb:amount ' + recipeJSON.boilSteps[b].fermentables[f].amount + ' . ';
				}
			}
		if(typeof recipeJSON.boilSteps[b].hops !== 'undefined') {
			for (var h = recipeJSON.boilSteps[b].hops.length - 1; h >= 0; h--) {
				insert += boilURI + ' mb:hasHops <' + recipeJSON.boilSteps[b].hops[h].href  + '> . ';
				insert += '<' + recipeJSON.boilSteps[b].hops[h].href + '> mb:amount ' + recipeJSON.boilSteps[b].hops[h].amount + ' ; ';
				insert += 'mb:hasAlphaAcidLowRange ' + recipeJSON.boilSteps[b].hops[h].aalow + ' . ';
				}
			}
		if(typeof recipeJSON.boilSteps[b].spices !== 'undefined') {
			for (var s = recipeJSON.boilSteps[b].spices.length - 1; s >= 0; s--) {
				insert += boilURI + ' mb:hasSpice <' + recipeJSON.boilSteps[b].spices[s].href  + '> . ';
				insert += '<' + recipeJSON.boilSteps[b].spices[s].href + '> mb:amount ' + recipeJSON.boilSteps[b].spices[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.boilSteps[b].fruits !== 'undefined') {
			for (var s = recipeJSON.boilSteps[b].fruits.length - 1; s >= 0; s--) {
				insert += boilURI + ' mb:hasFruit <' + recipeJSON.boilSteps[b].fruits[s].href  + '> . ';
				insert += '<' + recipeJSON.boilSteps[b].fruits[s].href + '> mb:amount ' + recipeJSON.boilSteps[b].fruits[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.boilSteps[b].notes !== 'undefined' && recipeJSON.boilSteps[b].notes.length > 0) {
			insert += fermURI + ' mb:notes "' + recipeJSON.boilSteps[b].notes + '" . ';
		}
	}

	//Fermentation step
	for (var k = recipeJSON.fermentationSteps.length - 1; k >= 0; k--) {
		var fermID = util.createID(),
		fermURI = '<' + mb.fermURI + fermID + '>';

		insert += recipeURI + ' mb:hasFermentationStep ' + fermURI + ' . ';
		insert += fermURI + ' rdf:type <' + recipeJSON.fermentationSteps[k].type + '> ; mb:isStep ' + recipeJSON.fermentationSteps[k].number + ' ; ';
		insert += ' mb:stepLength ' + recipeJSON.fermentationSteps[k].length + ' ; ';
		insert += ' mb:stepTemperature ' + recipeJSON.fermentationSteps[k].temperature + ' . ';

		if(typeof recipeJSON.fermentationSteps[k].volume !== 'undefined') {
		insert += fermURI + ' mb:volume ' + recipeJSON.fermentationSteps[k].volume + ' . ';
		}

		if(typeof recipeJSON.fermentationSteps[k].fermentables !== 'undefined') {
			for (var f = recipeJSON.fermentationSteps[k].fermentables.length - 1; f >= 0; f--) {
				insert += fermURI + ' mb:hasFermentable <' + recipeJSON.fermentationSteps[k].fermentables[f].href  + '> . ';
				insert += '<' + recipeJSON.fermentationSteps[k].fermentables[f].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].fermentables[f].amount + ' . ';
				}
			}
		if(typeof recipeJSON.fermentationSteps[k].hops !== 'undefined') {
			for (var h = recipeJSON.fermentationSteps[k].hops.length - 1; h >= 0; h--) {
				insert += fermURI + ' mb:hasHops <' + recipeJSON.fermentationSteps[k].hops[h].href  + '> . ';
				insert += '<' + recipeJSON.fermentationSteps[k].hops[h].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].hops[h].amount + ' ; ';
				insert += 'mb:hasAlphaAcidLowRange ' + recipeJSON.fermentationSteps[k].hops[h].aalow + ' . ';
				}
			}
		if(typeof recipeJSON.fermentationSteps[k].spices !== 'undefined') {
			for (var s = recipeJSON.fermentationSteps[k].spices.length - 1; s >= 0; s--) {
				insert += fermURI + ' mb:hasSpice <' + recipeJSON.fermentationSteps[k].spices[s].href  + '> . ';
				insert += '<' + recipeJSON.fermentationSteps[k].spices[s].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].spices[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.fermentationSteps[k].fruits !== 'undefined') {
			for (var s = recipeJSON.fermentationSteps[k].fruits.length - 1; s >= 0; s--) {
				insert += fermURI + ' mb:hasFruit <' + recipeJSON.fermentationSteps[k].fruits[s].href  + '> . ';
				insert += '<' + recipeJSON.fermentationSteps[k].fruits[s].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].fruits[s].amount + ' . ';
				}
			}
		if(typeof recipeJSON.fermentationSteps[k].yeasts !== 'undefined') {
			for (var y = recipeJSON.fermentationSteps[k].yeasts.length - 1; y >= 0; y--) {
				insert += fermURI + ' mb:hasFruit <' + recipeJSON.fermentationSteps[k].yeasts[y].href  + '> . ';
				insert += '<' + recipeJSON.fermentationSteps[k].yeasts[y].href + '> mb:amount ' + recipeJSON.fermentationSteps[k].yeasts[y].amount + ' . ';
				}
			}

		if(typeof recipeJSON.fermentationSteps[k].notes !== 'undefined' && recipeJSON.fermentationSteps[k].notes.length > 0) {
			insert += fermURI + ' mb:notes "' + recipeJSON.fermentationSteps[k].notes + '" . ';
		}
		if(typeof recipeJSON.botteling !== 'undefined') {
			// for (var b = recipeJSON.botteling.length - 1; b >= 0; b--) {

			// 	}
		}
	}
	insert += ' } }';
	where += ' WHERE { <' + recipeJSON.user[0].href + '> mb:hasID "' + recipeJSON.user[0].id +'" }';

	callback(null, prefix + insert + where);
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
			'mashSteps': [],
			'boilSteps': [],
			'fermentationSteps': [],

		};

	async.series({
		steps: function (callback) {
			var b = 0,
				m = 0,
				f = 0;
			for(var key in recipe) {
				if(key.indexOf(mb.mashURI) !== -1) {
					console.log('Mash Step: ' + key);

					apiJson.mashSteps.push({
						'number': recipe[key][mb.baseURI + 'isStep'][0].value,
						'href': key,
						'type': recipe[key]['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].value,
						'temperature': recipe[key][mb.baseURI + 'stepTemperature'][0].value,
						'length': recipe[key][mb.baseURI + 'stepLength'][0].value,
						'volume': recipe[key][mb.baseURI + 'volume'][0].value,
						'fermentables' : [],
						'hops' : [],
						'fruits': [],
						'spices': [],
					});

					//adds fermentables href to mash step

					if(typeof recipe[key][mb.baseURI + 'hasFermentable'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasFermentable'].length - 1; i >= 0; i--) {

								apiJson.mashSteps[m].fermentables.push({
										'href': recipe[key][mb.baseURI + 'hasFermentable'][i].value});
							};
						}
					//adds hops to mash step
					if(typeof recipe[key][mb.baseURI + 'hasHops'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasHops'].length - 1; i >= 0; i--) {
								apiJson.mashSteps[m].hops.push({
										'href': recipe[key][mb.baseURI + 'hasHops'][i].value});
							};
						}
					//adds fruits to mash step
					if(typeof recipe[key][mb.baseURI + 'hasFruit'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasFruit'].length - 1; i >= 0; i--) {
								apiJson.mashSteps[m].fruits.push({
										'href': recipe[key][mb.baseURI + 'hasFruit'][i].value});
							};
						}
					//adds spices to mash step
					if(typeof recipe[key][mb.baseURI + 'hasSpice'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasSpice'].length - 1; i >= 0; i--) {
								apiJson.mashSteps[m].spice.push({
										'href': recipe[key][mb.baseURI + 'hasSpice'][i].value});
							};
						}

					if(typeof recipe[key][mb.baseURI + 'notes'] !== 'undefined') {
						apiJson.mashSteps[m].notes =  recipe[key][mb.baseURI + 'notes'][0].value;
						}
						m++;
				}

				if(key.indexOf(mb.boilURI) !== -1) {
					console.log('Boil Step ' + b + ':' + key);
					apiJson.boilSteps.push({
						'number': recipe[key][mb.baseURI + 'isStep'][0].value,
						'href': key,
						'length': recipe[key][mb.baseURI + 'stepLength'][0].value,
						'fermentables' : [],
						'hops' : [],
						'fruits': [],
						'spices': [],
						});
					if(typeof recipe[key][mb.baseURI + 'volume'] !== 'undefined') {
						apiJson.boilSteps[b].volume = recipe[key][mb.baseURI + 'volume'][0].value;
						}
						//adds fermentebles to boils step
					if(typeof recipe[key][mb.baseURI + 'hasFermentable'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasFermentable'].length - 1; i >= 0; i--) {
								console.log('ferm: ' + recipe[key][mb.baseURI + 'hasFermentable'][i].value);
								apiJson.boilSteps[b].fermentables.push({
										'href': recipe[key][mb.baseURI + 'hasFermentable'][i].value});
							};
						}
					//adds hops to boil step
					if(typeof recipe[key][mb.baseURI + 'hasHops'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasHops'].length - 1; i >= 0; i--) {
								apiJson.boilSteps[b].hops.push({
										'href': recipe[key][mb.baseURI + 'hasHops'][i].value});
							};
						}

					//adds fruits to boil step
					if(typeof recipe[key][mb.baseURI + 'hasFruit'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasFruit'].length - 1; i >= 0; i--) {
								apiJson.boilSteps[b].fruits.push({
										'href': recipe[key][mb.baseURI + 'hasFruit'][i].value});
							};
						}
					//adds spices to mash step
					if(typeof recipe[key][mb.baseURI + 'hasSpice'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasSpice'].length - 1; i >= 0; i--) {
								apiJson.boilSteps[b].spice.push({
										'href': recipe[key][mb.baseURI + 'hasSpice'][i].value});
							};
						}
					if(typeof recipe[key][mb.baseURI + 'notes'] !== 'undefined') {
						apiJson.boilSteps[b].notes =  recipe[key][mb.baseURI + 'notes'][0].value;
						}
						b++;
				}
				if(key.indexOf(mb.fermURI) !== -1) {
					console.log('Ferm Step: ' + key);
					apiJson.fermentationSteps.push({
						'number': recipe[key][mb.baseURI + 'isStep'][0].value,
						'href': key,
						'type': recipe[key]['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].value,
						'temperature': recipe[key][mb.baseURI + 'stepTemperature'][0].value,
						'length': recipe[key][mb.baseURI + 'stepLength'][0].value,
						'fermentables': [],
						'hops' : [],
						'fruits': [],
						'spices': [],
					});
					if(typeof recipe[key][mb.baseURI + 'volume'] !== 'undefined') {
						apiJson.fermentationSteps[f].volume = recipe[key][mb.baseURI + 'volume'][0].value;
						}

						//adds fermentebles to fermentation step
					if(typeof recipe[key][mb.baseURI + 'hasFermentable'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasFermentable'].length - 1; i >= 0; i--) {
								console.log('ferm: ' + recipe[key][mb.baseURI + 'hasFermentable'][i].value);
								apiJson.fermentationSteps[f].fermentables.push({
										'href': recipe[key][mb.baseURI + 'hasFermentable'][i].value});
							};
						}
					//adds hops to fermentation step
					if(typeof recipe[key][mb.baseURI + 'hasHops'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasHops'].length - 1; i >= 0; i--) {
								apiJson.fermentationSteps[f].hops.push({
										'href': recipe[key][mb.baseURI + 'hasHops'][i].value});
							};
						}

					//adds fruits to fermentation step
					if(typeof recipe[key][mb.baseURI + 'hasFruit'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasFruit'].length - 1; i >= 0; i--) {
								apiJson.fermentationSteps[f].fruits.push({
										'href': recipe[key][mb.baseURI + 'hasFruit'][i].value});
							};
						}
					//adds spices to fermentation step
					if(typeof recipe[key][mb.baseURI + 'hasSpice'] !== 'undefined') {

							for (var i = recipe[key][mb.baseURI + 'hasSpice'].length - 1; i >= 0; i--) {
								apiJson.fermentationSteps[f].spice.push({
										'href': recipe[key][mb.baseURI + 'hasSpice'][i].value});
							};
						}

					if(typeof recipe[key][mb.baseURI + 'notes'] !== 'undefined') {
						apiJson.fermentationSteps[f].notes =  recipe[key][mb.baseURI + 'notes'][0].value;
						}
					f++;
				}

			}
			callback();
		},
		fermentables: function (callback) {
			ingredients.fermentables.getFermentebles
			callback();
		},
		hops: function (callback) {

			callback();
		},
		yeasts: function (callback) {
			callback();
		},
		others: function (callback) {
			callback();
		}

	}, function(error) {
		if(error) {
			callback(error);
		} else {
			callback(null,apiJson);
		}
	});
};

exports = module.exports = {
	'addRecipe': addRecipe,
	'getRecipe': getRecipe

};
