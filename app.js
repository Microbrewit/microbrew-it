
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
app.get('/mail', routes.mail);
app.get('/users', routes.list);
app.get('/beer/view', routes.beer); // todo: remove
app.get('/ask', routes.ask);

// users
app.get('/user/:userName', routes.breweryQuery);

// searches
app.get('/find/:searchTerms', routes.query);
app.get('/find/user/:name', routes.getBreweryName);
app.get('/find/brewery/:name', routes.getBreweryName);
app.get('/find/beer/:name', routes.getBeerName);

// beer and breweries
app.get('/brewery/:id', routes.breweryQuery);
app.get('/brewery/:brewery/:id', routes.breweryQuery);
app.get('/brewery/:brewery/:id/:beer', routes.beer);

// API
app.get('/api/add/beer', routes.insert);
app.get('/api/add/brewery', routes.insert);
app.get('/api/add/user', routes.insert);
app.get('/api/add/beer/rating', routes.insert);
app.get('/api/add/brewery/rating', routes.insert);
app.get('/api/user/:userName', routes.breweryQuery);
app.get('/api/find/:searchTerms', routes.query);
app.get('/api/find/user/:name', routes.getBreweryName);
app.get('/api/find/brewery/:name', routes.getBreweryName);
app.get('/api/find/beer/:name', routes.getBeerName);
app.get('/api/brewery/:id', routes.breweryQuery);
app.get('/api/brewery/:brewery/:id', routes.breweryQuery);
app.get('/api/brewery/:brewery/:id/:beer', routes.beer);



http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
