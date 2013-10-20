#### Cinematic SF: Mapping movies filmed in San Francisco

##### Design
For the Python/Flask backend, I exported the available dataset from [SF Data](https://data.sfgov.org/Arts-Culture-and-Recreation-/Film-Locations-in-San-Francisco/yitu-d5am) to a JSON file, [data.json](https://github.com/khennes/sf-movie-map/blob/master/static/js/data.json), then ran the JSON through a script, [geocode.py](https://github.com/khennes/sf-movie-map/blob/master/geocode.py), that geocoded each object's location string and added a new field for lat/long coordinates to it. The updated array, [geocoded.json](https://github.com/khennes/sf-movie-map/blob/master/static/js/geocoded.json), is loaded onto the client via a $.getJSON call. I chose to use a JSON in/out API for simplicity's sake, but if I'd been expecting to receive dynamic input from users, or if I knew the dataset would grow to be much larger, I would have used a SQL database.

The geocoding script took several passes to successfully handle all of the data. Using the [PyGeocoder](http://code.xster.net/pygeocoder/wiki/Home) wrapper to issue requests to the Geocoding API from the server side, I biased the results to a small area of SF using [this handy tool](http://jsfiddle.net/yV6xv/16/). At first, about half of the location strings returned irrelevant or zero results during the first several run-throughs of the geocode.py script. To debug the problem, I printed the strings causing the errors to a separate file, skimmed through it, and identified a few patterns that I could intercept through error handling. (The unicode character é, for instance, caused some errors, as did - surprisingly - several landmarks like City Hall and the Bay Bridge.)

On the other side, the frontend uses the Google Maps API, jQuery, Underscore.js, and Backbone.js, as well as Twitter's [typeahead.js](http://twitter.github.io/typeahead.js/) library for text field autocompletion. The user can filter the view by movie title, director, and/or year. The entire frontend is organized with Backbone and is composed of a single Model, two Collections, and a View; after loading the data from the server, [main.js](https://github.com/khennes/sf-movie-map/blob/master/static/js/main.js) loops through the JSON array and creates both a Google Maps marker and a Backbone Model (also 'marker') for each object. 

Previous experience with this stack: This was my first time using jQuery, Backbone.js, Underscore.js, and the Google Maps API, as well as Jasmine (while Python is the backend language I'm most proficient in).

##### Areas for improvement
Among other things, I would like the user to be able to filter the view by location (ie, typing in an address, landmark, or intersection). I'd most likely implement this by populating the typeahead.js menu with results from the Google Places API, then filtering the view to include movies filmed within a small radius of the location query.

##### Links
[LinkedIn](http://www.linkedin.com/in/khennes)
[Hackbright project](https://github.com/khennes/waffle)
