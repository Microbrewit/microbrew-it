
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
	app.configure('development', function(){
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
app.get('/mail', routes.mail);
app.get('/users', routes.list);
app.get('/beer/add', routes.insert);
app.get('/beer/view', routes.beer); // todo: remove
app.get('/q/:searchTerms', routes.query);
app.get('/b/:brewery', routes.breweryQuery);
// TODO app.get('/b/:brewery/:id/:beer', routes.beerQuery);
app.get('/ask', routes.ask);

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
