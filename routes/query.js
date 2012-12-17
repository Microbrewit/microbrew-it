var http = require('http'),
	querystring = require('querystring'),
	host = 'microbrewit.thunemedia.no',
	port = 8080,
	createInsertString = function (options, callback) {
		var prefixes = 'PREFIX mb:<http://www.microbrew.it/Beer/>',
			insert = 'INSERT DATA { ';
		if (!options.name) {
			callback(new Error('Name required'));
		} else {
			insert += 'mb:' + encodeURIComponent(options.name) + ' rdf:type mb:Beer';
			insert += '; mb:name "' + options.name + '"';
      insert += options.brewery ? ' ; mb:brewedBy <http://ontology.microbrew.it/Brewery/' + encodeURIComponent(options.brewery) + '>' : '';
      insert += options.styles ? '; mb:hasStyle "' + options.styles + '"' : '';
      insert += options.abv ? '; mb:abv "' + options.abv + '"' : '';
      insert += options.origin ? '; mb:origin "' + options.origin + '"' : '';
      insert += options.image ? '; mb:image "' + options.image + '"' : '';
      insert += options.bottle ? '; mb:bottle "' + options.bottle + '"' : '';
      insert += options.label ? '; mb:labe ":' + options.label + '"' : '';
      insert += options.comment ? '; mb:comment "' + options.comment + '"' : '';
      insert += options.description ? '; mb:description "' + options.description + '"' : '';
      insert += options.servingtype ? '; mb:servingType "' + options.servingtype + '"' : '';
      insert += options.glasstype ? '; mb:glassType "' + options.glasstype + '"' : '';
      insert += options.ibu ? '; mb:ibu "' + options.ibu + '"' : '';
      insert += options.aroma ? '; mb:aroma "' + options.aroma + '"' : '';
      insert += options.appearance ? '; mb:appearance "' + options.appearance + '"' : '';
      insert += options.mouthfeel ? '; mb:mouthfeel "' + options.mouthfeel + '"' : '';
      insert += options.colour ? '; mb:colour "' + options.colour + '"' : '';
      insert += options.barcode ? '; mb:barcode "' + options.barcode + '"' : '';
      insert +=  '}';


			console.log(prefixes + insert);
			callback(null, encodeURIComponent(prefixes + insert));
		}
	};

exports.insert = function (req, res) {
	createInsertString({'name': 'Borg Pilsner', 'brewery' : 'Hansa Borg'}, function (err, result) {
		var options = {
				'host': host,
				'port': port,
				'path': '/openrdf-sesame/repositories/microbrewit/statements?update=' + result,
				'headers': {
					'Content-Type': 'application/x-www-form-urlencoded'
        },
				'method': 'POST'
			},
			request = http.request(options, function (response) {
				res.writeHead(200, {'Content-Type' : 'text/plain'});
			  res.write('STATUS: ' + response.statusCode);
			  res.write('\nHEADERS: ' + JSON.stringify(response.headers));
				res.end('\nDone');
				//console.log(response);
		  });
		request.on('error', function (e) {
			console.log('problem with update request: ' + e.message);
			res.writeHead(500, {'Content-Type' : 'text/plain'});
			res.end(e.message);
		});
		request.end();
	});
};

exports.query = function (req, res) {
  var uri = '<' + req.param('uri') + '>';
  console.log('request param: ' + uri);

  var  prefix = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ',
    select = encodeURIComponent('SELECT ?b  WHERE {') + uri + encodeURIComponent(' ?a ?b }'),
    repository = '/openrdf-sesame/repositories/microbrewit?query=',
    returnedJSON = '',
    options = {
      'host': host,
      'port': port,
      'path': repository + encodeURIComponent(prefix) + select,
      'headers': { accept: 'application/sparql-results+json'},
      'method': 'GET'
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
  var name = req.param.name || '',
    prefix = 'PREFIX ns:<http://www.example.org/#>',
    insertStart = 'INSERT DATA { ns:',
    insertEnd = ' rdf:type ns:Person}',
    update = encodeURIComponent(prefix + insertStart + name + insertEnd),
    options = {
      'host': host,
      'port': port,
      'path': '/openrdf-sesame/repositories/microbrewit/statements?update=' + update,
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    },
    request = http.request(options, function (response) {
	    console.log('STATUS: ' + response.statusCode);
	    console.log('HEDERS: ' + JSON.stringify(response.headers));
      console.log('update request done');
    });
  console.log(prefix + insertStart + name + insertEnd);
  request.on('error', function (e) {
    console.log('poblem with update request: ' + e.message);
  });
  request.end();
	res.render('index', {title: 'Request Sent' });
};