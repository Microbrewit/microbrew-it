var chai = require('chai'),
	assert = chai.assert,
	expect = chai.expect,
	should = chai.should(),
	query = require('../app/query'),
	config = require('../app/config'),
	nock = require('nock');

describe('query module functionality', function () {
	describe('#insert()', function () {
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
		it('should accept beers with only a name', function (done) {
			var resBody,
				ts = nock('http://microbrewit.thunemedia.no:8080')
				.filteringRequestBody(/.*/, function (body) {
					resBody = body;	
					return '*';
				})
				.post('/openrdf-sesame/repositories/microbrewit/statements', '*')
				.reply(204, 'hei');
			query.insert({name: 'Hansa'}, function (err, response) {
				if (err) {
					throw new Error ('Threw error when name was present');
				}
				done();
			});
		});
	});
	it('should have a function for finding beers', function () {
		assert.isFunction(query.select);
	});
});
