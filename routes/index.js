var mail = require('../app/mail'),
	query = require('../app/query');
/*
 * GET Beer page.
 */

exports.beer = function (req, res) {
  res.render('beer', { title: 'Microbrewit' });
};
/*
 * GET home page.
 */

exports.index = function (req, res) {
  res.render('index', { title: 'Microbrewit' });
};

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};



exports.mail = function (req, res) {
	var param = url.parse(req.url, true).query,
		name = param.name,
		email = param.email;
	mail.save({'email': email, 'name': name}, function (err, res) {
		// Fire and forget
	});
	res.render('success', { title: 'Microbrewit' });
};

exports.insert = function (req, res) {
	var param = url.parse(req.url, true).query;
	query.insert({
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
		barcode : param.barcode
	}, function (err, response) {
		if (error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('inserted');
		}
	});
};

exports.query = function (req, res) {
	var beerURI = '<' + req.param('uri') + '>';
	query.select(beerURI, function (error, result) {
		if (error) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(error.message);
		} else {
			res.render('beer', result);
		}		
	});
};