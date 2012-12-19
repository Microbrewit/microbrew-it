assert = require('chai').assert
query = require '../routes/query.js'

describe 'query file functionality', () ->
	it 'should exist a function for insert', () ->
		assert.isFunction query.insert
	it 'should exist a function for query', () ->
		assert.isFunction query.query
	it 'should exist a function for put', () ->
		assert.isFunction query.put
