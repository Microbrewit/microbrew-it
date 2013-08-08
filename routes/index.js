'use strict';
var mb = require('../app/ontology').mb,
    url = require('url'),
    beersRoute = require('./beer.js'),
    usersRoute = require('./users.js'),
    breweriesRoute = require('./brewery.js'),
    yeastsRoute = require('./yeasts.js'),
    hopsRoute = require('./hops.js'),
    fermentablesRoute = require('./fermentables.js'),
    othersRoute = require('./others.js')
/*
 * GET home page.
 */

var index = function (req, res) {
    console.log(JSON.stringify(req.session));
    res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end('{"message" : "Hello world this is Microbrew.it api : )"}');
};

exports = module.exports = {
    'index': index,
    'beers': beersRoute,
    'users': usersRoute,
    'breweries' : breweriesRoute,
    'yeasts': yeastsRoute,
    'hops': hopsRoute,
    'fermentables': fermentablesRoute,
    'others': othersRoute
};
