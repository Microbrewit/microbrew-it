'use strict';
/*jslint nomen:true es5:true */
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.configure('development', function () {
		app.use(express.errorHandler());
		app.locals.pretty = true;
	});
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);

	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});

app.get('/', routes.index);

// testing TODO: remove when app works
app.get('/users', routes.list);
app.get('/ask', routes.ask);


// ================ FRONTEND ===============
// users
app.get('/user/:userName', routes.user);
app.get('/add/user', routes.addUser);
app.get('/login', routes.loginCheck);

// searches
app.get('/find/:searchTerms', routes.find);
// app.get('/find/user/:name', routes.findUser);
// app.get('/find/brewery/:name', routes.findBrewery);
// app.get('/find/beer/:name', routes.findBeer);

// beer and breweries
app.get('/brewery/:brewery/:id', routes.brewery);
app.get('/brewery/:id', routes.brewery);
// app.get('/brewery/:brewery/:id/:beer', routes.beer);

// add new beers and breweries
// app.get('/add/brewery', routes.addBrewery);
app.get('/add/beer', routes.addBeer);


// ======================= BACKEND =====================
// TODO: naming scheme for API routes functions
// app.get('/api/add/beer', routes.apiAddBeer);
// app.get('/api/add/brewery', routes.apiAddBrewery);
// app.get('/api/add/user', routes.apiAddUser);
// app.get('/api/add/beer/rating', routes.apiAddBeerRating);
// app.get('/api/add/brewery/rating', routes.apiAddBreweryRating);
// app.get('/api/user/:userName', routes.apiUser);
// app.get('/api/find/:searchTerms', routes.query);
// app.get('/api/find/user/:name', routes.getBreweryName);
// app.get('/api/find/brewery/:name', routes.getBreweryName);
// app.get('/api/find/beer/:name', routes.getBeerName);
// app.get('/api/brewery/:id', routes.breweryQuery);
// app.get('/api/brewery/:brewery/:id', routes.breweryQuery);
// app.get('/api/brewery/:brewery/:id/:beer', routes.beer);

app.get('/BeerStyle', routes.beerStyleQuery);

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
