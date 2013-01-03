// RDB connection details
exports.host = 'localhost';
exports.user = 'microbrewit';
exports.password = 'Trippel Dubbel IPA Pils';
exports.database = 'microbrewit';

// Triple store connection details 
exports.ts = {
	host : 'microbrewit.thunemedia.no',
	port : 8080,
	path:
		{
			insert	: '/openrdf-sesame/repositories/microbrewit/statements?update=',
			query	: '/openrdf-sesame/repositories/microbrewit?query='
		}
};
