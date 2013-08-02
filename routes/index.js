'use strict';
var mb = require('../app/ontology').mb,
    url = require('url'),
    beersRoute = require('./beer.js'),
    usersRoute = require('./users.js'),
    breweriesRoute = require('./brewery.js'),
    ingredientsRoute = require('./ingredients.js'),
    yeastsRoute = require('./yeasts.js');
/*
 * GET home page.
 */

var index = function (req, res) {
    res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end('{"message" : "Hello world this is Microbrew.it api : )"}');
};

exports = module.exports = {
    'index': index,
    'beers': beersRoute,
    'users': usersRoute,
    'breweries' : breweriesRoute,
    'ingredients': ingredientsRoute,
    'yeasts': yeastsRoute
};
