function initialize() {
    'use strict';

    // create map instance
    var map = new google.maps.Map(document.getElementById('map-canvas'), { 
        center: new google.maps.LatLng(37.775057, -122.419281),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    /**
     * Construct & initialize Backbone MVC variables
     * Model: marker
     * Collections: allMarkers, allFilters
     * View: markerView
     **/

    var Marker = Backbone.Model.extend({});
    var Markers = Backbone.Collection.extend({
        model: Marker
    });     

    var allMarkers = new Markers();
    var allFilters = new Markers();

    var markersList = {};  // object to store Google Maps marker objects
    var infoWindows = {};

    var MarkerView = Backbone.View.extend({
        el: $('body'),
        events: {
            'click #go': 'showFilter',
            'click #reset': 'showAll'
        },
        initialize: function() {
            _.bindAll(this, 'showFilter', 'showAll', 'render');
            this.showAll();
        },
        showFilter: function() {
            var filter_options = {};

            var title_query = $('#by-title').val();
            var director_query = $('#by-director').val();
            var year_query = $('#by-year').val();
            // TODO: location queries to be handled differently


            if (title_query != '') {
                filter_options['title'] = title_query;
            }

            if (director_query != '') {
                filter_options['director'] = director_query;
            }
        
            if (year_query != '') {
                filter_options['year'] = year_query;
            }

            var match_filters = this.collection.where(filter_options);
            console.log(match_filters);

            if (match_filters.length > 0) {
                allFilters.add(match_filters);
                this.render(allFilters.models);
            } else {
                $('#user-message').text('No results found');
                this.render(this.collection.models);
            }
        },
        showAll: function() {
            this.render(this.collection.models);
        },
        render: function(models) {
            for (var key in markersList) {
                markersList[key].setVisible(false);  // clear map
            }
            _.each(models, function(el) {
                markersList[el.attributes.id].setVisible(true);
            });

            return this;
        }
    });


    // Create info window and marker for each scene in JSON array, add to collection
    // Populate arrays for autompletion/filtering
    $.getJSON('static/js/geocoded.json', function(data) {
        var SCENES = data.length;

        for (var i = 0; i < SCENES; i++) {
            var scene = data[i];
            if (scene['latlong']) {  // (TODO: only jsonify valid locations before passing to client)

                
                /**
                 * Create a marker for each scene, add Marker model to collection 
                 * Star icons courtesy of http://mapicons.nicolasmollet.com/
                 **/

                // Google Maps marker
                var marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(scene['latlong'][0], scene['latlong'][1]),
                    icon: 'static/js/star-3.png',
                    title: scene['title'],
                    visible: false,
                    zIndex: i
                });

                // my Backbone model marker
                var newMarker = new Marker();
                newMarker.set({
                    title: scene['title'],
                    id: i,  // Backbone marker id will match Maps marker zIndex
                    year: scene['release_year'],
                    director: scene['director'],
                    position: new google.maps.LatLng(scene['latlong'][0], scene['latlong'][1])
                });

                markersList[i] = marker;
                allMarkers.push(newMarker);


                /**
                 * Create infowindow, bind to marker
                 **/

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

                infoWindows[i] = infoWindow;

                // bind infoWindow to its marker
                google.maps.event.addListener(markersList[i], 'click', function(index) {
                    return function() {
                        infoWindows[index].open(map, markersList[index]);
                        google.maps.event.addListener(map, 'click', function() {
                            infoWindows[index].close();  // click away to close infowindow
                        });
                    }
                }(i));
            }
        }

        // instantiate Backbone view
        var markerView = new MarkerView({
            collection: allMarkers
        });


        /**
         * Populate arrays for autocompletion options (for 'filter by' fields)
         **/

        var titles = _.uniq(allMarkers.pluck('title'), true);
        var directors = _.uniq(allMarkers.pluck('director'), true);
        var years = _.uniq(allMarkers.pluck('year'), true);
        // var locations = _.uniq(allMarkers.pluck('latlong'), true);


        $("#by-title").typeahead({ 
            name: 'titles',
            local: titles 
        });

        $("#by-director").typeahead({ 
            name: 'directors',
            local: directors 
        });

        $("#by-year").typeahead({ 
            name: 'years',
            local: years 
        });

        // TODO: Location filter

    });
}


function loadScript() {
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAAHAi7BkDviZMKVSG1hr4lSkEAW2EWM9g&sensor=false&callback=initialize";
    $('body').append(script);
}

$('document').ready(loadScript);
