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

 var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

    next();
}

 app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.configure('development', function () {
        app.use(express.errorHandler());
        app.locals.pretty = true;
    });
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(allowCrossDomain);
    app.use(express.session({
        store: new RedisStore(),
        secret: 'fortesting756498',
        domain: '.microbrew.it'}
    ));
    app.use(app.router);
 });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });


// // === INDEX
app.get('/', routes.index);

// // === USER ROUTES
app.post('/users', routes.users.addUpdateUser);
app.post('/users/changepassword', routes.users.changePassword);
app.post('/users/login', routes.users.login); //?username=...&password=...
app.post('/users/logout', routes.users.logout);
app.get('/users/details/:ids', routes.users.details);

// // === INGREDIENTS ROUTES
app.get('/fermentables', routes.ingredients.fermentables);
app.get('/fermentables/:fermentable', routes.ingredients.fermentable);
app.get('/hops', routes.ingredients.hops);
app.post('/hops', routes.ingredients.updateHops);
app.get('/hops/:hop', routes.ingredients.hop);
app.get('/yeasts', routes.yeasts.yeasts);
app.get('/yeasts/:yeast', routes.yeasts.yeast);
app.get('/others', routes.ingredients.others);


// 404
app.use(function(req,res){
    res.writeHead(404, {'Content-Type' : 'application/json'});
    res.end('{"error" : "Endpoint not found."}');
});
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
