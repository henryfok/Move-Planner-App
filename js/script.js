function loadData() {

	var $body = $('body');
	var $wikiHeaderElem = $('#wikipedia-header');
	var $wikiElem = $('#wikipedia-links');
	var $nytHeaderElem = $('#nytimes-header');
	var $nytElem = $('#nytimes-articles');
	var $greeting = $('#greeting');

	var streetStr = $("#street").val();
	var cityStr = $("#city").val();
	if (cityStr == '') {
		console.log("User input empty!");
		$greeting.text('Please fill in the street and city fields.')
		return false;
	}
	
	// clear out old data before new request
	$wikiElem.text("");
	$nytElem.text("");

	// load streetview
	var streetViewInt = 'https://maps.googleapis.com/maps/api/streetview?';
	var streetViewSize = 'size=600x300';
	var streetViewKey = '&key=' + config.streetViewKey;
	
	var address = streetStr + ', ' + cityStr;
	console.log('Address: ' + address);

	$(greeting).text('So you want to live at ' + address + '?');

	var streetViewLocation = '&location=';
	// var streetViewURL = streetViewInt + streetViewSize + streetViewLocation + address + streetViewKey;
	// var streetViewURLEncoded = encodeURIComponent(streetViewURL);
	// console.log('Street View URL: ' + streetViewURL);
	// console.log('Encoded: ' + streetViewURLEncoded);

	var streetViewURLTEST = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=40.720032,-73.988354&fov=90&heading=235&pitch=10' + streetViewKey;
	
	var streetViewImg = '<img class="bgimg" src="' + streetViewURLTEST + '">';

	$body.append(streetViewImg);

	// load NYT
	var nytKey = config.nytKey;
	var nytURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

	// $.ajax({
	// 	url: nytURL,
	// 	data: {'api-key': nytKey, 'q': "cityStr"}
	// })
	// .done(function(data) {
	// 	console.log("success");
	// 	console.log(data);
	// })
	// .fail(function() {
	// 	console.log("error");
	// })
	// .always(function() {
	// 	console.log("complete");
	// });

	$.getJSON(nytURL, {'api-key': nytKey, 'q': cityStr}, function(data) {
		$nytElem.text('NYT Aricles About ' + cityStr);
		console.log(data);
		var articles = data.response.docs;
		// console.log(articles);
		for (var i=0; i<articles.length; i++) {
			$nytElem.append('<li><a href="' + articles[i].web_url + '">' + articles[i].headline.main + '</a></li>');
			$nytElem.append('<p>' + articles[i].snippet + '</p>');
		}

	}).fail(function() {
		console.log('NYT API Error!');
		$nytHeaderElem.text('New York Times Articles about ' + cityStr + ' cannot be loaded.');
	});

	// load wiki
	var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json';

	var wikiRequestTimeout = setTimeout(function() {
		$wikiElem.text('Failed to load Wikipedia content.');
	}, 5000);	// Timeout after 5 seconds

	$.ajax({
		url: wikiURL,
		dataType: 'jsonp',
		success: function(data) {
			$wikiHeaderElem.text('Relevant Wikipedia Links About ' + cityStr);
			console.log(data);
			var wikiTitle = "";
			var wikiSnippet = "";
			var wikiLink;
			for (var i=0; i<data[1].length; i++) {
				
				for (var j=1; j<data.length; j++) {
					// console.log(data[j][i])
					if (j == 1) {
						wikiTitle = data[j][i];
					}
					if (j == 2) {
						wikiSnippet = data[j][i];
					}
					if (j == 3) {
						wikiLink = data[j][i];
						console.log(wikiLink);
					}
				}
				$wikiElem.append('<li><a href="' + wikiLink + '">' + wikiTitle + '</a></li><p>' + wikiSnippet + '</p>');
			}
			clearTimeout(wikiRequestTimeout);
		}
	});
	
	return false;
};

$('#form-container').submit(loadData);