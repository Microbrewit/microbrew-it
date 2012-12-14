var http = require('http');
var querystring = require('querystring');

exports.query = function (req, res) {
  var uri = '<' + req.param('uri') + '>';
  console.log('request param: ' + uri);

  var  prefix = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ',
    select = encodeURIComponent('SELECT ?b  WHERE {') + uri + encodeURIComponent(' ?a ?b }'),
    repository = '/openrdf-sesame/repositories/geekbeer?query=',
    returnedJSON = '',
    options = {
      host: 'collos.zapto.org',
      port: 8088,
      path: repository + encodeURIComponent(prefix) + select,
      headers: { accept: 'application/sparql-results+json'},
      method: 'GET'
    },

    request = http.request(options, function (response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEDERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log(response);
        returnedJSON += chunk;
      });
      response.on('end', function () {
        var json = JSON.parse(returnedJSON);
        res.render('beer', {title: 'Query Results', BeerJSON: json });
      });
    });
  request.on('error', function (e) {
    console.log('poblem with request: ' + e.message);
  });
  request.end();
};

exports.put = function (req, res) {
  var name = req.param('name'),
    prefix = 'PREFIX ns:<http://www.example.org/#>',
    insertStart = 'INSERT DATA { ns:',
    insertEnd = ' rdf:type ns:Person}',
    update = encodeURIComponent(prefix + insertStart + name + insertEnd),
    options = {
      host: 'collos.zapto.org',
      port: 8088,
      path: '/openrdf-sesame/repositories/geekbeer/statements?update=' + update,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    },
    request = http.request(options, function (response) {
	    console.log('STATUS: ' + response.statusCode);
	    console.log('HEDERS: ' + JSON.stringify(response.headers));
      console.log('update request done');
    });
  request.on('error', function (e) {
    console.log('poblem with update request: ' + e.message);
  });
  request.end();
	res.render('index', {title: 'Request Sent' });
};