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
    };
    for (var key in originGraph) {
		apiJson.origins.push({
			'id': 'comming soon',
			'href': key,
			'name': originGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value
			});
    }

    callback(null, apiJson);
};



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
    };

var apiFormattingSuppliers = function (supplierGraph, callback) {
	var apiJson = {
			'meta': {
			'size':supplierGraph.length
			},
			'links': {

			},
			'suppliers' :[
			]
    },
    j = 0;
    for (var key in supplierGraph) {
		apiJson.suppliers.push({
			'id': supplierGraph[key][mb.baseURI + 'hasID'][0].value,
			'href': key,
			'name': supplierGraph[key]['http://www.w3.org/2000/01/rdf-schema#label'][0].value,
			'suppliesid': [],
			});
			if(typeof supplierGraph[key][mb.baseURI + 'locatedIn'] !== 'undefined') {
					apiJson.suppliers[j].locatedin = supplierGraph[key][mb.baseURI + 'locatedIn'][0].value;
				}
			for (var i = supplierGraph[key][mb.baseURI + 'supplies'].length - 1; i >= 0; i--) {
				apiJson.suppliers[j].suppliesid.push(supplierGraph[key][mb.baseURI + 'supplies'][i].value);
			}
		j++;
    }

    callback(null, apiJson);
};

var getSuppliers = function(callback) {
	var graph = '<' + mb.baseURI + 'SupplierGraph>';
	ts.graph(graph, function (err, supplierGraph) {
		if(err) {
			callback(err);
		} else {
			apiFormattingSuppliers(supplierGraph, function (error, result) {
           if(error) {
			callback(error);
           } else {
			callback(null, result);
           }
		});
		//callback(null,supplierGraph);

		}
	});
};

var getSupplier = function (supplierID, callback) {
	var apiSupplier = {
			'meta': {
			'size':	1
			},
			'links': {

				},
				'origin': {
					'href': 'http://api.microbrew.it/origin/:originid',
					'type': 'origin'
				},
			'suppliers' :[]
		};

	getSuppliers(function (err, res) {
		if(err) {
			callback(err);
		} else {
			for (var i = res.length - 1; i >= 0; i--) {
				if(res[i].id === supplierID) {
					apiSupplier.suppliers.push(res[i]);
			}
		}
		if(apiSupplier.suppliers.length === 0) {
			callback(null,  {'error': {
								'message' : 'Not a dry  extract.',
								'code': 234531
							}
						});
		} else {
		callback(null, apiSupplier);
		}
		}
	});

};

exports = module.exports = {
    'getOrigins': getOrigins,
    'getSuppliers': getSuppliers
};
