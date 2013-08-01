'use strict';
/*jslint nomen:true es5:true */
/**
 * Module dependencies.
 */

 var express = require('express'),
 RedisStore = require('connect-redis')(express),
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
    app.use(express.cookieParser());
    app.use(express.session({
        store: new RedisStore(),
        secret: 'fortesting756498',
        domain: '.microbrew.it'}
    ));
    app.use(app.router);

    app.use(express.static(path.join(__dirname, 'public')));
 });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });


// // === INDEX
//app.get('/', routes.index);

// // === USER ROUTES
app.get('/user/add', routes.user.addUser);
app.get('/user/update', routes.user.updateUser);
app.get('/user/changepassword', routes.user.changePassword);
app.get('/user/login', routes.user.login); //?username=...&password=...
app.get('/user/logout', routes.user.logout);
app.get('/user/details/:username', routes.user.details);

// // === INGREDIENTS ROUTES
app.get('/fermentables', routes.ingredients.fermentables);

// app.get('/', function(req, res){
//     console.log(JSON.stringify(req.session));
//     if(req.query.add !== undefined)
//         req.session.counter = (req.session.counter)? req.session.counter + 1 : 10;
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     res.end("{message: " + req.session.counter + "}");
// });

// // === Beer Routes
// // Find out how to separate beer and recipees in api.

// // testing TODO: remove when app works
// app.get('/users', routes.list);
// app.get('/ask', routes.ask);


// // ================ FRONTEND ===============
// // users
// app.get('/user/:userName', routes.user);
// app.get('/add/user', routes.addUser);
// app.get('/login', routes.loginCheck);

// // searches
// app.get('/find/:searchTerms', routes.find);
// // app.get('/find/user/:name', routes.findUser);
// // app.get('/find/brewery/:name', routes.findBrewery);
// // app.get('/find/beer/:name', routes.findBeer);

// // beer and breweries
// app.get('/brewery/:brewery/:id', routes.brewery);
// app.get('/brewery/:id', routes.brewery);
// // app.get('/brewery/:brewery/:id/:beer', routes.beer);

// // add new beers and breweries
// // app.get('/add/brewery', routes.addBrewery);
// app.get('/add/beer', routes.addBeer);


// // ======================= BACKEND =====================
// // TODO: naming scheme for API routes functions
// // app.get('/api/add/beer', routes.apiAddBeer);
// // app.get('/api/add/brewery', routes.apiAddBrewery);
// // app.get('/api/add/user', routes.apiAddUser);
// // app.get('/api/add/beer/rating', routes.apiAddBeerRating);
// // app.get('/api/add/brewery/rating', routes.apiAddBreweryRating);
// // app.get('/api/user/:userName', routes.apiUser);
// // app.get('/api/find/:searchTerms', routes.query);
// // app.get('/api/find/user/:name', routes.getBreweryName);
// // app.get('/api/find/brewery/:name', routes.getBreweryName);
// // app.get('/api/find/beer/:name', routes.getBeerName);
// // app.get('/api/brewery/:id', routes.breweryQuery);
// // app.get('/api/brewery/:brewery/:id', routes.breweryQuery);
// // app.get('/api/brewery/:brewery/:id/:beer', routes.beer);

// app.get('/BeerStyle', routes.beerStyleQuery);


// 404
app.use(function(req,res){
    res.render('404.jade');
});
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
