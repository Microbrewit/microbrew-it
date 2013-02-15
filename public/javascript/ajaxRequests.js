var requestTimeout;

function doShitWithCallback(data) {
	console.log(data);
	if(data.results.bindings.length < 1) {
		console.log('Found nothing');
		$('#beerName .typeahead').empty();
	} else {
		var beerNameTypeahead = $('#beerName .typeahead');
		if($('#beerName .typeahead').length < 1) {
			$('#beerName').append('<ul class="typeahead"></ul>');
			console.log('no typeahead');
		}

		$('#beerName .typeahead').empty();

		for(var i=0;i<data.results.bindings.length;i++) {
			var beerItem = data.results.bindings[i];
			var beerString = '<li><a href="' + beerItem.url.value + '">' + beerItem.name.value;
			beerString += '<br />brewed by ' + beerItem.breweryName.value;
			beerString += '</a></li>'
			$('#beerName .typeahead').append(beerString);
		}
	}
}
function getShit(queryStr, type) {
	console.log(queryStr);
	if(type == 'beer') {
		$.get('http://localhost:3000/find/beer/'+ queryStr, function(data) {
			doShitWithCallback(data);
		});
	} else if(type == 'brewery') {
		$.get('http://localhost:3000/find/brewery/'+ queryStr, function(data) {
			doShitWithCallback(data);
		});
	}
}

$('#name').on('keyup', function(e) {
	e.preventDefault();
	if($(this).val().length > 0) {
		window.clearTimeout(requestTimeout);
		requestTimeout = window.setTimeout(function () { getShit($('#name').val(), 'beer') }, 250);
	}
 	
});

$('#name').blur(function() {
	$(this).siblings('.typeahead').empty();
});
