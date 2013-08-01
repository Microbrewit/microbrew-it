'use strict';
var query = require('../app/query'),
	mb = require('../app/ontology').mb,
	url = require('url');
	//user = require('../app/user');

var beerRoute = require('./beer.js'),
 userRoute = require('./user.js'),
 breweryRoute = require('./brewery.js'),
 ingredientsRoute = require('./ingredients.js');



/*
 * GET home page.
 */

var index = function (req, res) {
	res.render('index', { title: 'Microbrewit' });
};

exports = module.exports = {
	'index': index,
	'beer': beerRoute,
	'user': userRoute,
	'brewery' : breweryRoute,
	'ingredients': ingredientsRoute
};
// };

// /*
//  * GET users listing.
//  */

// exports.list = function (req, res) {
// 	res.send("respond with a resource");
// };

// exports.addBeer = function (req, res) {
// 	var param = url.parse(req.url, true).query;
// 	console.log(param);
// 	if (param.name) {
// 		query.insert({
// 			uri : param.uri,
// 			name : param.name,
// 			brewery : param.brewery,
// 			styles : param.styles,
// 			abv : param.abv,
// 			origin : param.origin,
// 			image : param.image,
// 			bottle : param.bottle,
// 			label : param.label,
// 			comment : param.comment,
// 			description : param.description,
// 			servingtype : param.servingtype,
// 			glasstype : param.glasstype,
// 			ibu : param.ibu,
// 			aroma : param.aroma,
// 			appearance : param.appearance,
// 			mouthfeel : param.mouthfeel,
// 			colour : param.colour,
// 			barcode : param.barcode,
// 			breweryturi : param.breweryturi
// 		}, function (error, response) {
// 			if (error) {
// 				res.writeHead(500, {'Content-Type': 'text/plain'});
// 				res.end(error.message);
// 			} else {
// 				console.log('Hello from routes');
// 				console.log(response);
// 				res.render('addBeer', response);
// 			}
// 		});
// 	} else {
// 		query.findBeerStyles( function (err, styles) {
// 		if(err) {
// 			console.log(err);
// 		}else {
// 			console.log(styles);
// 		res.render('addBeer', styles);

// 		}
// 	});
// 	}
// };

// exports.addBrewery = function (req, res) {
// 	var param = url.parse(req.url, true).query;
// 	console.log(param);
// 	res.render('addBrewery', {});

// };

// exports.user = function (req, res) {
// 	res.writeHead(500, {'Content-Type': 'text/plain'});
// 	res.end('Exception: Mothefucking internal shit with arrays error'); // TODO: add error view
// };

// exports.addUser = function (req, res) {
// 	var param = url.parse(req.url, true).query;
// 		if(param.email) {
// 	user.setUser(param, function (error, result) {
// 			console.log("test");
// 		if(error) {
// 			res.writeHead(500, {'Content-Type': 'text/plain'});
// 			res.end(error.message);
// 		} else {
// 			res.writeHead(200, {'Content-Type': 'text/plain'});
// 			res.end(result);
// 		}
// 		});
// 		} else {
// 			res.render('addUser', {});
// 		}
// 		};

// exports.loginCheck = function (req, res) {
// 	var param = {name : "tom", email : "tom@jack.no", password : "jack"};
// 	user.passwordCheck(param, function (error, result) {
// 		if(error) {
// 			console.log("error" + error);
// 		} else {
// 			console.log("result" + result);
// 		}
// 	});
// };

// exports.find = function (req, res) {
// 	var beerName = req.params.searchTerms;

// 	console.log(beerName);
// 	query.select(beerName, function (error, result) {
// 		if (error) {
// 			res.writeHead(500, {'Content-Type': 'text/plain'});
// 			res.end(error.message);
// 		} else {
// 			if (result.results.bindings.length <= 1) {
// 				res.render('beer', result);
// 			} else {
// 				res.writeHead(500, {'Content-Type': 'text/plain'});
// 				res.end('Exception: Mothefucking internal shit with arrays error'); // TODO: add error view
// 			}
// 			// res.writeHead(200, {'Content-Type' : 'application/json'});
// 			// res.end(JSON.stringify(result));
// 		}
// 	});
// };

// exports.ask = function (req, res) {
// 	var askString = '<http://www.microbrew.it/beer/Trippel%20Torstein>' + mb.ibu + ' ?a';
// 	query.ask(askString, function (error, result) {
// 		if (error) {
// 			res.writeHead(500, {'Content-Type': 'text/plain'});
// 			res.end(error.message);
// 		} else {
// 			//res.render('beer', result);
// 			res.writeHead(200, {'Content-Type' : 'text/plain'});
// 			res.end(result);
// 		}
// 	});
// };

// // TODO change lookups to use ID
// exports.brewery = function (req, res) {
// 	var breweryID = req.params.id;
// 	var breweryName = req.params.brewery;

// 	console.log('Looking up brewery with name ' + breweryName);
// 	query.findBrewery(breweryName, function (error, result) {
// 	    if (error) {
// 	      res.writeHead(500, {'Content-Type': 'text/plain'});
// 	      res.end(error.message);
// 	    } else {
// 	    	console.log(result);
// 	    	res.render('brewery', result);
// 	      // res.writeHead(200, {'Content-Type': 'application/json'});
// 	      // res.end(JSON.stringify(result));
// 	    }
//   });
// };

// exports.breweryQuery = function (req, res) {
// 	var breweryName = req.params.brewery;
// 	console.log(breweryName);
// 	query.findBrewery(breweryName, function (error, result) {
// 		if (error) {
// 			res.writeHead(500, {'Content-Type': 'text/plain'});
// 			res.end(error.message);
// 		} else {
// 		//res.render('brewery', result);
// 			res.writeHead(200, {'Content-Type': 'application/json'});
// 			res.end(JSON.stringify(result));
// 		}
// 	});
// };
// exports.beerStyleQuery = function (req, res) {
// 	query.findBeerStyles(function (error, result) {
// 		if (error) {
// 			res.writeHead(500, {'Content-Type': 'text/plain'});
//       		res.end(error.message);
// 		} else {
// 			res.writeHead(200, {'Content-Type': 'application/json'});
//       		res.end(JSON.stringify(result));
// 		}
// 	});
// };

// exports.getBeerName = function (req, res) {
// 	var nameString = req.params.name;
// 	query.beerName(nameString, function (error, result) {
// 		if (error) {
// 			res.writeHead(500, {'Content-Type': 'text/plain'});
// 			res.end(error.message);
// 		} else {
// 			//res.render('beer', result);
// 			res.writeHead(200, {'Content-Type' : 'application/json'});
// 			res.end(JSON.stringify(result));
// 		}
// 	});
// };

// exports.getBreweryName = function (req, res) {
// 	var nameString = req.params.name;
// 	query.breweryName(nameString, function (error, result) {
// 		if (error) {
// 			res.writeHead(500, {'Content-Type': 'text/plain'});
// 			res.end(error.message);
// 		} else {
// 			//res.render('beer', result);
// 			res.writeHead(200, {'Content-Type' : 'application/json'});
// 			res.end(JSON.stringify(result));
// 		}
// 	});
// };

