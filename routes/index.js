var http = require('http');
/*
 * GET home page.
 */

exports.index = function (req, res) {
  var  prefix = 'PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> ' +
	  'PREFIX gb:<http://www.w3.org/2011/12/beer.owl#> ',
    select = 'SELECT ?title WHERE { ?title rdf:type gb:Beer}',
    repository = '/openrdf-sesame/repositories/geekbeer?query=',
    returnedJSON = '',
    options = {
      host: 'collos.zapto.org',
      port: 8088,
      path: repository + encodeURIComponent(prefix + select) + '&infer=true',
      headers: { accept: 'application/sparql-results+json'},
      method: 'GET'
    },

    request = http.request(options, function (response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEDERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        returnedJSON += chunk;
      });
      response.on('end', function () {
        var json = JSON.parse(returnedJSON),
          beerOptions = '',
          i = 0,
          jsonLength = json.results.bindings.length;
        for (i; i < jsonLength; i++) {
          beerOptions += ' <option value=' + JSON.stringify(json.results.bindings[i].title.value) + '>BEER:' + i + '</option>';
          console.log(JSON.stringify(json.results.bindings[i].title.value));
        }
        res.render('index', {title: 'Geek Beer Selection', beerOptions: beerOptions });
      });
    });
  request.on('error', function (e) {
    console.log('poblem with request: ' + e.message);
  });
  request.end();
};