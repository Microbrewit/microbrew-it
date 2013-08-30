'use strict';

var mb = require('../ontology').mb,
	prefix = require ('../ontology').prefix,
	util = require('../util'),
	ts = require('../triplestore'),
    async = require ('async');

var addRecipe = function(recipeJSON, callback) {
	createInsertQuery(recipeJSON, function (err, query) {
		if(err) {
			callback(err);
		} else {
			ts.insert(query, function (error, result) {
				if(error) {
					callback(error);
				} else {
					callback(result);
				}
			});
		}
	});
};

var createInsertQuery = function(recipeJSON, callback) {
	var recipeID = util.createID(),
	recipeURI = '<' + mb.baseURI.recipeURI + recipeID + '>',
	insert = '',
	where = '';

	insert += 'INSERT DATA { GRAPH ' + recipeURI + ' { ';
	insert += recipeURI + ' rdf:type mb:Recipe ; rdf:type owl:NamedIndividual ; mb:brewedBy ?user ';
	insert += ' } }';

	where += 'WHERE {?user mb:hasID "' + recipeJSON.user.id +' }';

	callback(null, prefix + insert + where);
};

exports = module.exports = {
	'addRecipe': addRecipe,

};
