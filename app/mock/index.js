
exports.fermentables = {
                      'meta': {
                        'total': 123608,
                        'returned': 2,
                        'skip': 0,
                        'size': 2
                      },
                      'links': {
                          'fermentables.maltster': {
                          'href': 'http://api.microbrew.it/maltsters/:maltsterid/',
                          'type': 'maltster'
                        }
                      },
                      'fermentables': [{
                        'id': 'http://microbrew.it/ontology/fermentables/Amber_Malt',
                        'href': 'http://api.microbrew.it/fermentables/:Amber_Malt',
                        'maltster': 'Best Malz',
                        'fermentablename': 'Amber Malt',
                        'colour': '20',
                        'ppg': '34',
                        'type': 'grain',
                        'links': {
                          'maltsterid': '1234'
                        }
                      },
                      {
                        'id': 'http://microbrew.it/ontology/fermentables/Pale_Ale_Malt',
                        'href': 'http://api.microbrew.it/fermentables/Pale_Ale_Malt',
                        'maltster': 'Weyermann',
                        'fermentablename': 'Pale Ale Malt',
                        'colour': '2',
                        'ppg': '37',
                        'type': 'grain',
                        'links': {
                          'maltsterid': '4321'
                        }
                      }]
                      }