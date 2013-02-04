Microbrew.it
========

The web back end, and web app for microbrew.it.

REMEMBER
nested sparql query:
	PREFIX mb:<http://ontology.microbrew.it/>

	SELECT *
	WHERE {
		?child mb:hasParent mb:2.
		?child mb:hasParent* ?parent
		}
