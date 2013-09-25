
exports.recipe = {
		'brewer': [{
			'id': 1377263864213,
			'href': 'http://microbrew.it/users/torstein'
		}],
		'recipename' : 'Brun Bjarne',
		'recipestyle': 'http://microbrew.it/ontology.owl#Belgian-Style_Dubbel',
		'mashSteps' :[
			{
				'number': 1,
				'type': 'http://microbrew.it/ontology.owl#Infusion',
				'length': 60,
				'volume': 20,
				'temperature': 65,
				'fermentables': [
					{
						'id': '1377073452234',
						'href': 'http://microbrew.it/ontology.owl#Boortmalt_Amber_Malt',
						'name': 'Amber Malt',
						'colour': '20',
						'ppg': '34',
						'suppliedbyid': 'http://microbrew.it/ontology.owl#Boortmalt',
						'origin': 'Germany',
						'suppliedBy': 'Boortmalt',
						'amount': 20
					},
					{
						'id': '1377073452234',
						'href': 'http://microbrew.it/ontology.owl#mb:Simpsons_Pale_Ale_Malt',
						'name': 'Pale Ale Malt',
						'amount': 50
					},

				],
				'hops': [],
				'spices': [],
				'fruits': [],
				'notes': ''
			}
		],

		'boilSteps': [
			{
				'number': 2,
				'length': 60,
				'volume': 20,
				'fermentables': [],
				'hops': [
					{
						'href': 'http://microbrew.it/ontology#Summit',
						'aalow': 5,
						'amount': 50
					},
					{
						'href': 'http://microbrew.it/ontology#Willamette',
						'aalow': 5,
						'amount': 50
					},
				],
				'spices': [],
				'fruits': [],
				'notes': ''
			},
			{
				'number': 3,
				'length': 0,
				'volume': 20,
				'fermentables': [],
				'hops': [],
				'spices': [],
				'fruits': [
					{
					'href':'http://microbrew.it/ontology#Strawberry',
					'amount': 30
					}
				],
				'notes': ''
			}
		],

		'fermentationSteps' : [
			{
				'number': 4,
				'type': 'http://microbrew.it/ontology#Primary',
				'length': 14,
				'temperature': 24,
				'fermentables': [],
				'hops': [
					{
						'href': 'http://microbrew.it/ontology#Summit',
						'aalow': 5,
						'amount': 50
					},
					{
						'href': 'http://microbrew.it/ontology#Willamette',
						'aalow': 5,
						'amount': 50
					},

				],
				'spices': [],
				'fruits': [],
				'yeasts': [],
				'notes': ''
			}
		],

		'bottling' : [
			{
				'fermentables': []
			},
		],

		'notes': '',
	};

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
                      };

exports.fermentable = {
                      'meta': {
                        'total': 123608,
                        'returned': 1,
                        'skip': 0,
                        'size': 1
                      },
                      'links': {
                          'fermentables.maltster': {
                          'href': 'http://api.microbrew.it/maltsters/:maltsterid/',
                          'type': 'maltster'
                        }
                      },
                      'fermentables': {
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
                      }
                    };

