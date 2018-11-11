var $body = $('body');
var $wikiHeaderElem = $('#wikipedia-header');
var $wikiElem = $('#wikipedia-links');
var $nytHeaderElem = $('#nytimes-header');
var $nytElem = $('#nytimes-articles');
var $greeting = $('#greeting');

var streetStr = '';
var cityStr = '';

var map;
var geocoder = new google.maps.Geocoder;

var geoLocated = false;
var autocomplete;
var componentForm = {
	street_number: 'short_name',
	route: 'long_name',		//street name
	locality: 'long_name',	//city
	administrative_area_level_1: 'short_name',	//province or state
	country: 'long_name',
	postal_code: 'short_name'
};

$('#form-container').submit(loadData);
$('#autocomplete').on('focus', function() {
	if (!geoLocated) {
		geoLocate();
		initAutocomplete();
		geoLocated = true;
	}
});

function loadData() {
	// streetStr = $("#street").val();
	// cityStr = $("#city").val();
	if (streetStr == '' || cityStr == '') {
		console.log("User input empty!");
		$greeting.text('Please fill in the street and city fields.')
		return false;
	}
	
	// clear out old data before new request
	$wikiElem.text("");
	$nytElem.text("");

	loadStreetView();
	loadNYT();
	loadMap();
	geocodeAddress(geocoder, map);
	loadWiki();
	// loadTweets();

	return false;
};

function initAutocomplete() {
	// Create the autocomplete object, restricting the search to geographical location types.
	autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('autocomplete')),
		{types: ['geocode']}
	);

	// When the user selects an address from the dropdown, populate the address fields in the form.
	autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
	streetStr = '';
	cityStr = '';
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();
	// console.log('Formatted Address: ' + place.formatted_address);
	parseGoogleAddress(place);
	loadData();
}

function geoLocate() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
			geocodeLatLng(geocoder, geolocation);
		});
	}
}

function geocodeAddress(geocoder, resultsMap) {
	var address = streetStr + ', ' + cityStr;
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function geocodeLatLng(geocoder, latlng) {
	geocoder.geocode({'location' : latlng}, function(result, status) {
		if (status == 'OK') {
			if (result.length > 0) {
				console.log(result);
				parseGoogleAddress(result[0]);
				loadData();
			}
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function parseGoogleAddress(address) {
	for (var i = 0; i < address.address_components.length; i++) {
		var addressType = address.address_components[i].types[0];
		if (componentForm[addressType]) {
			var val = address.address_components[i][componentForm[addressType]];
		}
		if (addressType == 'street_number') {
			streetStr += (val + ' ');
			// console.log('Street String: ' + streetStr);
		}
		if (addressType == 'route') {
			streetStr += (val + ' ');
			// console.log('Street String: ' + streetStr);
		}
		if (addressType == 'locality') {
			cityStr += (val + ' ');
			// console.log('City String: ' + cityStr);
		}
		if (addressType == 'administrative_area_level_1') {
			cityStr += (val + ' ');
			// console.log('City String: ' + cityStr);
		}
	}
}

function loadStreetView() {
	var streetViewInt = 'https://maps.googleapis.com/maps/api/streetview?';
	var streetViewSize = 'size=640x360';
	var streetViewKey = '&key=' + config.streetViewKey;
	
	var address = streetStr + ', ' + cityStr;
	console.log('Address: ' + address);

	$(greeting).text('So you want to live at ' + address + '?');

	var streetViewLocation = '&location=' + address;
	var streetViewURL = streetViewInt + streetViewSize + streetViewLocation + streetViewKey;
	// console.log('Street View URL: ' + streetViewURL);

	// var streetViewURLTEST = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=40.720032,-73.988354&fov=90&heading=235&pitch=10' + streetViewKey;
	
	var streetViewImg = '<img class="bgimg" src="' + streetViewURL + '">';

	$body.append(streetViewImg);
}

function loadMap() {
	$("#map").css("height", "300px")
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 14
	});
	// geocoder = new google.maps.Geocoder();
}

function loadNYT() {
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
		$nytHeaderElem.text('NYT Aricles About ' + cityStr);
		console.log(data);
		var articles = data.response.docs;
		// console.log(articles);
		var nytImageURL = '';
		for (var i=0; i<articles.length; i++) {
			$nytElem.append('<li class="article"><a href="' + articles[i].web_url + '" target="_blank">' + 
				articles[i].headline.main + '</a></li>' +
				'<p>' + articles[i].snippet + '</p>');
				// articles[i].snippet);
			
			if (articles[i].multimedia.length > 0) {
				nytImageURL = articles[i].multimedia[0].url
				for(var j=0; j<articles[i].multimedia.length; j++) {
					if (articles[i].multimedia[j].subType == 'xlarge') {
						nytImageURL = articles[i].multimedia[j].url;
					}
				}
				$nytElem.append('<img class="nytImage" src="' + 'https://static01.nyt.com/' + nytImageURL + '">');
			}
			
			// https://static01.nyt.com/images/2018/05/30/world/31CANADA-01/merlin_137976807_dcfeb0af-0103-41d0-a41e-fc9e101cb4a0-articleLarge.jpg
			// $nytElem.append('<div class="card"><div class="card-body">' + 
			// 	'<h5 class="card-title"><a href="' + articles[i].web_url + '">' + articles[i].headline.main + '</a></h5>' +
			// 	'<p class="card-text">' + articles[i].snippet + '</p>' +
			// 	'</div></div>');
		}

	}).fail(function() {
		console.log('NYT API Error! Retrying...');
		$nytHeaderElem.text('New York Times Articles about ' + cityStr + ' cannot be loaded.');
		$.ajax(this);

	});
}

function loadWiki() {
	var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json';

	var wikiRequestTimeout = setTimeout(function() {
		$wikiElem.text('Failed to load Wikipedia content.');
	}, 3000);	// Timeout after 3 seconds

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
					}
				}
				$wikiElem.append('<li class="article"><a href="' + wikiLink + '" target="_blank">' + wikiTitle + '</a></li><p>' + wikiSnippet + '</p>');
			}
			clearTimeout(wikiRequestTimeout);
		}
	});
}

// function loadTweets() {
// 	var twitterURL = 'https://api.twitter.com/1.1/search/tweets.json?q=' + cityStr;
// 	$.ajax({
// 		url: twitterURL,
// 		dataType: "json",
// 		data: {
// 			oauth_consumer_key: '',
// 			oauth_signature: ''
// 		},
// 	})
// 	.done(function() {
// 		console.log("success");
// 	})
// 	.fail(function() {
// 		console.log("error");
// 	})
// 	.always(function() {
// 		console.log("complete");
// 	});
	
// }