#### Cinematic SF: Mapping movies filmed in San Francisco

##### Design
For the backend, I exported the dataset from [SF Data](https://data.sfgov.org/Arts-Culture-and-Recreation-/Film-Locations-in-San-Francisco/yitu-d5am) to a JSON file, then ran the JSON through a script, [geocode.py](https://github.com/khennes/sf-movie-map/blob/master/geocode.py) that geocoded each location string and added a new field for lat/long coordinates to each object in the array. The updated array, [geocoded.json](https://github.com/khennes/sf-movie-map/blob/master/static/js/geocoded.json), is loaded onto the client via a jQuery#.getJSON call.

The frontend uses the Google Maps API, jQuery, Underscore.js, and Backbone.js, as well as Twitter's [typeahead.js](http://twitter.github.io/typeahead.js/) library for text field autocompletion. The user can filter the view by movie title, director, and/or year. (The `#nav-box` element has a drawer effect upon clicking the star in the upper-left corner.) The client fetches the JSON data from the server and creates both a Google Maps marker and a Backbone Model, also 'marker', for each object. 

###### Areas for improvement
Among other things, I would like the user to be able to filter the view by location (ie, typing in an address, landmark, or intersection). I'd most likely implement this by populating the typeahead.js menu with results from the Google Places API, then filtering the view to include movies filmed within a small radius of the location query. Also, I would like the map to automatically pan to capture all results in a filtered view.


