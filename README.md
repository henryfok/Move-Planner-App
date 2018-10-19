# Move Planner App

Simple web app that finds information about a location and displays a Google Street View of the location.
![alt text](https://raw.githubusercontent.com/henryfok/Move-Planner-App/master/app_preview.gif)

## Setup

For security reasons, developer API keys for Google Street View and New York Times are not pushed. You will need to obtain your own keys and follow the instructions below.

* Create a new .js file called config.js in the same directory as script.js
* Add the following code to config.js, replacing with your respective API keys

```
var config = {
	streetViewKey : 'YOUR_STREETVIEW_KEY',
	nytKey : 'YOUR_NYT_KEY'
}
```

* You may want to consider adding config.js to .gitignore

### APIs used

| API | LINK |
| ------ | ------ |
| Google Street View API | https://developers.google.com/maps/documentation/streetview/ |
| New York Times Article Search API | http://developer.nytimes.com/ |
| MediaWiki Action API | https://www.mediawiki.org/wiki/Special:MyLanguage/API:Main_page |

You do not need an API key for MediaWiki because it uses JSNOP.