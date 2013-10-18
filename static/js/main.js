function initialize() {
    'use strict';

    // Create map instance
    var map = new google.maps.Map(document.getElementById('map-canvas'), { 
        center: new google.maps.LatLng(37.775057, -122.419281),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Initialize Backbone MVC variables
    var Marker = Backbone.Model.extend({});
    var Markers = Backbone.Collection.extend({
        model: Marker
    });     

    var allMarkers = new Markers();
    var allFilters = new Markers();

    // object to store Google Maps markers
    var markersList = {};

    // Create info window and marker for each scene in JSON array, add to collection
    // Populate arrays for autompletion/filtering
    $.getJSON('static/js/geocoded.json', function(data) {
        var SCENES = data.length;

        for (var i = 0; i < SCENES; i++) {
            var scene = data[i];
            if (scene['latlong']) {  // (TODO: only jsonify valid locations before passing to client)

                // create info window, specify content
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
                    content: contentString,
                    pixelOffset: 2
                });

                
                /**
                 * Create a marker for each scene, add Marker model to collection 
                 * Star icons courtesy of http://mapicons.nicolasmollet.com/
                 **/

                // Google Maps marker
                var marker = new google.maps.Marker({
                    map: null,  // leave it to the MarkerView to hide/render the icon
                    position: new google.maps.LatLng(scene['latlong'][0], scene['latlong'][1]),
                    icon: 'static/js/star-3.png',
                    zIndex: i
                });

                // my Backbone model marker
                var newMarker = Marker.extend({
                    title: scene['title'],
                    id: i,  // Backbone marker id will match Maps marker zIndex
                    year: scene['release_year'],
                    director: scene['director'],
                    position: new google.maps.LatLng(scene['latlong'][0], scene['latlong'][1])
                });

                markersList[i] = marker;
                allMarkers.push(newMarker);

                google.maps.event.addListener(marker, 'click', function() {
                    // TODO: clicks away should close info window
                    infoWindow.open(map,marker);
                });
            }
        }


        /**
         * Populate arrays for autocompletion options (for 'filter by' fields)
         **/

        var titles = _.pluck(allMarkers.models, 'title');
        var directors = _.pluck(allMarkers.models, 'director');
        var years = _.pluck(allMarkers.models, 'year');
        // var locations = _.pluck(allMarkers, 'latlong');

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

        // $("#by-location").typeahead({ 
        //     name: 'locations',
        //     remote:  
        // });
    });
    
    console.log(allMarkers);

    var MarkerView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'showFilter', 'showAll', 'render');
            this.showAll();
        },
        events: {
            'click #go': 'showFilter',
            'click #reset': 'showAll'
        },
        showFilter: function() {
            var filter_options = {};

            var title_query = $('#by-title').val();
            var director_query = $('#by-director').val();
            var year_query = $('#by-year').val();
            // var location_query = $('#by-location').val();


            if (title_query != null) {
                filter_options[title] = title_query;
            }

            if (director_query != null) {
                filter_options[director] = director_query;
            }
        
            if (year_query != null) {
                filter_options[year] = year_query;
            }

            // TODO: location queries to be handled differently

            var match_filters = allMarkers.where(filter_options);

            console.log(match_filters);

            if (match_filters.length > 0) {
                allFilters.add(match_filters);
                this.render(allFilters);
            } else {
                $('#user-message').text('No results found');
                this.render(this.collection);
            }
        },
        showAll: function() {
            this.render(this.collection);
        },
        render: function(collection) {
            console.log(collection);
            _.each(collection, function(el) {
                console.log("call meeee");
                markersList[el.id].setMap(map);
            });
        }
    });

    var markerView = new MarkerView({
        collection: allMarkers
    });
}


function loadScript() {
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAAHAi7BkDviZMKVSG1hr4lSkEAW2EWM9g&sensor=false&callback=initialize";
    $('body').append(script);
}

$('document').ready(loadScript);
