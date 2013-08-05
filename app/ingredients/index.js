'use strict';
var http = require('http'),
	config = require('../config'),
	mb = require('../ontology').mb,
	util = require('../util'),
	ts = require('../triplestore'),
	yeasts = require('./yeasts.js'),
	hops = require('./hops.js'),
	fermentables = require('./fermentables.js'),
	others = require('./others.js');


exports = module.exports = {
	'yeasts': yeasts,
	'fermentables': fermentables,
	'hops': hops,
	'others': others
};
