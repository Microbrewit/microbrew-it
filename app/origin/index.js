var config = require('../config'),
  mb = require('../ontology').mb,
  util = require('../util'),
  ts = require('../triplestore');

var apiFormattingOrigins = function (originGraph, callback) {
	var apiJson = {
			'meta': {
			'size':	originGraph.length
			},
			'links': {

			},
			'origins' :[
			]
    }
    for (var key in originGraph) {
    	apiJson.origins.push({
    		'id': 'comming soon',
    		'href': key,
    		'name': originGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value
    	});
    }

    callback(null, apiJson);
}



var getOrigins = function (callback) {
  var graph = '<' + mb.baseURI + 'OriginGraph>';
  ts.graph(graph, function (err, originGraph) {
    if (err) {
    	callback(err);
  	} else {
  		apiFormattingOrigins(originGraph, function (error, result) {
           if(error) {
           	callback(error);
           } else {
           	callback(null, result);
           }
  		});
  		//callback(null,originGraph);
  	}
  });
    }


exports = module.exports = {
    'getOrigins': getOrigins
};
