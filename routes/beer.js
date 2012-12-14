
/*
 * GET Beer page.
 */

exports.beer = function (req, res) {
  res.render('beer', { title: 'Microbrewit' });
};