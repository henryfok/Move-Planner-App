function loadData() {

	var $body = $('body');
	var $wikiElem = $('#wikipedia-links');
	var $nytHeaderElem = $('#nytimes-header');
	var $nytElem = $('#nytimes-articles');
	var $greeting = $('#greeting');

	// clear out old data before new request
	$wikiElem.text("");
	$nytElem.text("");

	// load streetview
	var streetViewInt = 'https://maps.googleapis.com/maps/api/streetview?';
	var streetViewSize = 'size=600x300';
	var streetViewKey = '&key=' + config.streetViewKey;
	
	var streetStr = $("#street").val();
	var cityStr = $("#city").val();
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
	console.log('nytURL: ' + nytURL);

	// $.ajax({
	// 	url: nytURL,
	// 	data: {'api-key': nytKey, 'q': "vancouver"}
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

	$.getJSON(nytURL, {'api-key': nytKey, 'q': "vancouver"}, function(data) {
			$nytElem.text('NYT Aricles About Vancouver');

			var articles = data.response.docs;
			console.log(articles);
			for (var i=0; i<articles.length; i++) {
				$nytElem.append('<li><a href="' + articles[i].web_url + '">' + articles[i].headline.main + '</a></li>');
				$nytElem.append('<p>' + articles[i].snippet + '</p>');
			}

	});
	

	return false;
};

$('#form-container').submit(loadData);