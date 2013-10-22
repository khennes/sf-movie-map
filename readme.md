## SF Movie Map 

#### This project maps where movies have been filmed in San Francisco.

To get started, I exported the available dataset from [SF Data](https://data.sfgov.org/Arts-Culture-and-Recreation-/Film-Locations-in-San-Francisco/yitu-d5am) to a JSON file, [data.json](https://github.com/khennes/sf-movie-map/blob/master/static/js/data.json), then wrote a script ([geocode.py](https://github.com/khennes/sf-movie-map/blob/master/geocode.py)) that geocoded each object's location string and gave it a new property for lat/long coordinates. The updated array, [geocoded.json](https://github.com/khennes/sf-movie-map/blob/master/static/js/geocoded.json), is loaded onto the client via a `$.getJSON` call. (I initially set up a PostgreSQL database, then chose to use a JSON in/out API instead for simplicity's sake.) Using the [PyGeocoder](http://code.xster.net/pygeocoder/wiki/Home) wrapper to issue requests to the Google Geocoding API from the server side, I biased the results to a small area of SF using [this handy tool](http://jsfiddle.net/yV6xv/16/) to identify the coordinates. 

On the other side, the frontend uses the Google Maps API, jQuery, Underscore.js, and Backbone.js, as well as Twitter's [typeahead.js](http://twitter.github.io/typeahead.js/) library for text field autocompletion. The user can filter the view by movie title, director, and/or year. The entire frontend is organized with Backbone and is composed of a single Model, two Collections, and a View.

Previous experience with this stack: This is the first thing I've built with jQuery, Backbone.js (which I learned to complete this challenge), Underscore.js, and the Google Maps API. It's also my first experience with the Mocha/Chai testing framework.

Areas for improvement: Among other things, I would like the user to be able to filter the view by location (eg, by typing in an address, landmark, or intersection). I'd most likely implement this by populating the typeahead.js menu with results from the Google Places API, then filtering the view to include movies filmed within a specific radius of the (geocoded) query. I'd also like for the user to be able to display multiple filters of the same type and close them individually. (Note: This project has not been tested in IE.)

### Links
+ [Demo!](http://sf-movie-map.herokuapp.com)
+ [LinkedIn profile](http://www.linkedin.com/in/khennes)
+ [Hackbright project](https://github.com/khennes/waffle)
