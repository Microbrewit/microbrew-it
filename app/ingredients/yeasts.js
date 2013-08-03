'use strict';
var http = require('http'),
    config = require('../config'),
    mb = require('../ontology').mb,
    ts = require('../triplestore');

var getYeasts = function (callback) {
    var select =    'SELECT DISTINCT *';
        select +=   ' WHERE { ';
        select +=   '?typeuri rdfs:subClassOf ' + mb.yeast + ' ; rdfs:label ?type . ?yeast a ?typeuri; rdfs:label ?yeastname .';
        select +=	'FILTER(?typeuri != ' + mb.yeast + ' ) .'
        select +=   '}';
        console.log(select);
        ts.select(select, function (err, result) {
            if(err) {
                console.log(err);
                callback({'statuscode': 500, 'error': err});
            } else {
                callback(null, {'statuscode': 200, 'result': result});
            }
        });
};

exports = module.exports = {
    'getYeasts': getYeasts
};
