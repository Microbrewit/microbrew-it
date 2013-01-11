var query = require('../app/query'),
	mb = require('../app/ontology').mb,
	url = require('url');

/*
 * GET home page.
 */

exports.index = function (req, res) {
  res.render('index', { title: 'Microbrewit' });
};

/*
 * GET users listing.
 */

exports.list = function (req, res) {
  res.send("respond with a resource");
};

exports.addBeer = function (req, res) {
	var param = url.parse(req.url, true).query;
	console.log(param);
	if(param.name) {
		query.insert({
			uri : param.uri,
			name : param.name,
			brewery : param.brewery,
			styles : param.styles,
			abv : param.abv,
			origin : param.origin,
			image : param.image,
			bottle : param.bottle,
			label : param.label,
			comment : param.comment,
			description : param.description,
			servingtype : param.servingtype,
			glasstype : param.glasstype,
			ibu : param.ibu,
			aroma : param.aroma,
			appearance : param.appearance,
			mouthfeel : param.mouthfeel,
			colour : param.colour,
			barcode : param.barcode,
			breweryturi : param.breweryturi
		}, function (error, response) {
			if (error) {
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.end(error.message);
			} else {
				console.log('Hello from routes');
				console.log(response);
				res.render('addBeer', response);
			}
		});
	} else {
		res.render('addBeer');
	}
};

exports.user = function (req, res) {
	res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end('Exception: Mothefucking internal shit with arrays error'); // TODO: add error view
};

exports.find = function (req, res) {
	var beerName = req.params.searchTerms;

	console.log(beerName);
	query.select(beerName, function (error, result) {
		if (error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			if (result.results.bindings.length <= 1) {
				res.render('beer', result);
			} else {
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.end('Exception: Mothefucking internal shit with arrays error'); // TODO: add error view
			}
			// res.writeHead(200, {'Content-Type' : 'application/json'});
			// res.end(JSON.stringify(result));
		}
	});
};

exports.ask = function (req, res) {
	var askString = '<http://www.microbrew.it/beer/Trippel%20Torstein>' + mb.ibu + ' ?a';
	query.ask(askString, function (error, result) {
		if (error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			//res.render('beer', result);
			res.writeHead(200, {'Content-Type' : 'text/plain'});
			res.end(result);
		}
	});
};

// TODO change lookups to use ID
exports.brewery = function (req, res) {
	var breweryID = req.params.id;
	var breweryName = req.params.brewery;

	console.log('Looking up brewery with name ' + breweryName);
	query.findBrewery(breweryName, function (error, result) {
	    if (error) {
	      res.writeHead(500, {'Content-Type': 'text/plain'});
	      res.end(error.message);
	    } else {
	    	console.log(result);
	    	res.render('brewery', result);
	      // res.writeHead(200, {'Content-Type': 'application/json'});
	      // res.end(JSON.stringify(result));
	    }
  });
};

exports.breweryQuery = function (req, res) {
	var breweryName = req.params.brewery;
	console.log(breweryName);
  query.findBrewery(breweryName, function (error, result) {
    if (error) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end(error.message);
    } else {
    //res.render('brewery', result);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(result));
    }

  });

};

exports.getBeerName = function (req, res) {
	var nameString = req.params.name;
	query.beerName(nameString, function (error, result) {
		if (error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			//res.render('beer', result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
};

exports.getBreweryName = function (req, res) {
	var nameString = req.params.name;
	query.breweryName(nameString, function (error, result) {
		if (error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			//res.render('beer', result);
			res.writeHead(200, {'Content-Type' : 'application/json'});
			res.end(JSON.stringify(result));
		}
	});
};
