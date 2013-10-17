/**
 * Render the map and initially display all markers
 **/

function initialize() {

    /**
     * Create map instance
     **/
 
    var mapOptions = {
        center: new google.maps.LatLng(37.775057, -122.419281),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


    /**
     * Backbone models and views
     **/

    var Marker = Backbone.Model.extend({
        defaults: {
            title: null,
            id: null,
            year: null,
            director: null,
            position: null }
    });

    var Markers = Backbone.Collection.extend({
        model: Marker
    });

    // create instance of Backbone collection
    var allmarkers = new Markers();


    /**
     * Given each scene/film site as an object, create an info window,
     * Backbone model, and Maps marker for each.
     **/

    function setMarker(i, data) {
        var scene = data[i];
        if (scene['latlong']) {  // only jsonify valid locations before passing to client

            var contentString = "<div class='content'>" +
                "<div id='siteNotice'>" +
                "</div>" +
                "<h1 id='firstHeading' class='firstHeading'>" + 
                scene['title'] + " (" + scene['release_year'] + ")</h1>" +
                "<div id='bodyContent'>" +
                "<p>Director: " + scene['director'] + "</p>" +
                "<p>Location: " + scene['locations'] + "</p>" +
                "</div>";

            if (scene['fun_facts']) {
                var funFact = "<p>Fun fact: " + scene['fun_facts'] + "</p>";
                contentString += funFact;
            }

            contentString += "</div>";
                
            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });

            
            /**
             * Place marker for each scene/location in JSON array
             * Add marker to MasterCollection of markers (Backbone model)
             * Star icons courtesy of http://mapicons.nicolasmollet.com/
             **/

            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(scene['latlong'][0], scene['latlong'][1]),
                icon: 'static/js/star-3.png',
                zIndex: i
            });

            // create instance of Marker model and add to master collection
            var newMarker = Marker.extend({
                title: scene['title'],
                id: i,
                year: scene['release_year'],
                director: scene['director'],
                position: new google.maps.LatLng(scene['latlong'][0], scene['latlong'][1])
            });

            allmarkers.push(newMarker);

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(map,marker);
            });
        }
    }


    /** 
     * Fetch array of geocoded JSON objects and call setMarker() on each; 
     * Bias location results towards BOUNDS
     *
     * Populate local arrays for autocompletion search (filter options).
     **/

    
    $.getJSON('static/js/geocoded.json', function(data) {
        var SCENES = data.length;

        var titles = {};
        var directors = {};
        var years = {};

        for (var i = 0; i < SCENES; i++) {
            setMarker(i, data);
            titles[data[i]['title']] = titles[data[i]['title']] + 1 || 1;
            directors[data[i]['director']] = directors[data[i]['director']] + 1 || 1;
            years[data[i]['release_year']] = years[data[i]['release_year']] + 1 || 1;
        }

        // describe autocomplete options
        $("#by-title").typeahead({ 
            name: 'titles',
            local: Object.keys(titles)
        });

        $("#by-director").typeahead({ 
            name: 'directors',
            local: Object.keys(directors)
        });

        $("#by-year").typeahead({ 
            name: 'years',
            local: Object.keys(years)
        });

        // $("#by-location").typeahead({ local: locations });
    });

    var title_query, director_query, year_query, location_query;

    var filtered_title = allmarkers.get(title_query);
    var filtered_director = allmarkers.get(director_query);
    var filtered_year = allmarkers.get(year_query);
    var filtered_location = allmarkers.get(location_query);

    /*
    $('#go').click(function(event) {

        // first, set each in allmarkers to null
        // marker.setMap(null);

        var Filters = Backbone.Collection.extend({
            model: Marker
        });

        var allfilters = new Filters();

        var FilterView = Backbone.View.extend({
            render: function() {
               var matched_markers = [];
                this.collection.each(function() {
                    // render markers whose zIndex = Marker id
                    // marker.setMap(map);
                }
            });
        });

        var filtered_models = allmarkers.where({ 
            title: filtered_title,
            year: filtered_year,
            director: filtered_director,
            location: filtered_location
        });

        allfilters.add(filtered_models);
    });
*/

    $('#reset').click(function(event) {});
}


function loadScript() {
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAAHAi7BkDviZMKVSG1hr4lSkEAW2EWM9g&sensor=false&callback=initialize";
    document.body.appendChild(script);
}

window.onload = loadScript;
