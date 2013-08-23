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
    app.use(allowCrossDomain);
    app.use(express.cookieParser());
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
app.get('/fermentables', routes.fermentables.fermentables);
app.get('/fermentables/grains', routes.fermentables.grains);
app.get('/fermentables/grains/:grain', routes.fermentables.grain);
app.get('/fermentables/sugars', routes.fermentables.sugars);
app.get('/fermentables/sugars/:sugar', routes.fermentables.sugar);
app.get('/fermentables/extracts', routes.fermentables.extracts);
app.get('/fermentables/extracts/dryextracts', routes.fermentables.dryExtracts);
app.get('/fermentables/extracts/dryextracts/:dryextract', routes.fermentables.dryExtract);
app.get('/fermentables/extracts/liquidextracts', routes.fermentables.liquidExtracts);
app.get('/fermentables/extracts/liquidextracts/:liquidextract', routes.fermentables.liquidExtract);
app.get('/fermentables/extracts/:extract', routes.fermentables.extract);

app.get('/fermentables/:fermentable', routes.fermentables.fermentable);
app.get('/hops', routes.hops.hops);
app.post('/hops', routes.hops.updateHops);
app.get('/hops/:hop', routes.hops.hop);
app.get('/yeasts', routes.yeasts.yeasts);
app.get('/yeasts/liquidyeasts', routes.yeasts.liquidYeasts);
app.get('/yeasts/liquidyeasts/:liquidyeast', routes.yeasts.liquidYeast);
app.get('/yeasts/dryyeasts', routes.yeasts.dryYeasts);
app.get('/yeasts/dryyeasts/:dryyeast', routes.yeasts.dryYeast);
app.get('/yeasts/:yeast', routes.yeasts.yeast);
app.get('/others', routes.others.others);
app.get('/origins', routes.origins);
app.get('/suppliers', routes.suppliers);


// 404
app.use(function(req,res){
    res.writeHead(404, {'Content-Type' : 'application/json'});
    res.end('{"error" : "Endpoint not found."}');
});
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
