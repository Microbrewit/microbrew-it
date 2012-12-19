var chai = require('chai'),
	assert = chai.assert,
	expect = chai.expect,
	should = chai.should(),
	query = require('../app/query'),
	config = require('../app/config'),
	nock = require('nock');

describe('query module functionality', function () {
	describe('#insert()', function () {
		var url = 'http://' + config.ts.host + ':' + config.ts.port,
			status,
			ts = nock(url)
				.persist()
				.filteringRequestBody(/.*/, function (body) {
					return body.match(/.*fail.*/) ? 'fail' : 'success';
				})
				.post(config.ts.path.insert, 'success')
				.reply(204, 'body')
				.post(config.ts.path.insert, 'fail')
				.reply(500, 'body');
		it('should exist', function () {
			assert.isFunction(query.insert);
		});
		it('should return an error when no name is present', function (done) {
			query.insert({}, function (err) {
				if (!err) {
					throw new Error ('Accepted without name!');
				}
				done();
			});
		});
		it('should return an error when the response from the ts is different that 204 accepted', function (done) {
			query.insert({name: 'fail'}, function (err, response) {
				err.should.eql(new Error('Insertion was not accepted'));
				done();
			});
		});
		it('should accept beers with only a name', function (done) {
			query.insert({name: 'Hansa'}, function (err, response) {
				if (err) {
					throw new Error (err.message);
				}
				done();
			});
		});
		it('should return a String with the generated SPARQL query', function (done) {
			query.insert({name: 'Hansa'}, function (err, res) {
				if (err) {
					throw new Error(err.message);
				}
				var decodedQuery = decodeURIComponent(res.query);
				decodedQuery.should.be.a('string');
				decodedQuery.should.match(/PREFIX.*INSERT.*Hansa.*/);
			});
			done();
		});
	});
	it('should have a function for finding beers', function () {
		assert.isFunction(query.select);
	});
});
