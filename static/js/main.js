function initialize() {
    'use strict';

    // create map instance
    var mapCenter = new google.maps.LatLng(37.775057, -122.419281);
    var map = new google.maps.Map(document.getElementById('map-canvas'), { 
        center: mapCenter,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    /**
     * Define and construct Backbone MVC variables
     *
     * 'Marker' extends Backbone.Model;
     * 'Markers' extends Backbone.Collection; and
     * 'MarkerView' extends Backbone.View
     **/

    var Marker = Backbone.Model.extend({});
    var Markers = Backbone.Collection.extend({
        model: Marker
    });     

    // instantiate two collections
    var allMarkers = new Markers();
    var allFilters = new Markers();

    var MarkerView = Backbone.View.extend({
        el: document.body,
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

            // capture user's input and pass to filter_options (only if not empty)
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

            if (match_filters.length > 0) {
                allFilters.reset(match_filters);
                this.render(allFilters.models);
                $('#nav-box').addClass('active');  // close drawer
            } else {
                $('#user-message').text('No results found');
                this.render(this.collection.models);  // if no matches, render entire collection
            }
        },
        showAll: function() {
            map.setCenter(mapCenter);
            map.setZoom(13);
            this.render(this.collection.models);
        },
        render: function(models) {
            $('.filter').val('');  // clear input fields
            $('input').typeahead('setQuery', '');

            // create drawer effect on navbox
            $('#cue').on('click', function() {
                $('#nav-box').toggleClass('active');
            });

            _.each(allMarkers.models, function(el) {
                el.attributes.mapMarker.setVisible(false);  // clear map
            });
            _.each(models, function(el) {
                el.attributes.mapMarker.setVisible(true);  // show markers 
            });

            return this;
        }
    });


    /**
     * Populate arrays for autocompletion options (for 'filter by' fields)
     **/

    function loadAutocomplete(masterCollection) {

        var titles = _.uniq(masterCollection.pluck('title'), true);
        var directors = _.uniq(masterCollection.pluck('director'), false);
        var years = _.uniq(masterCollection.pluck('year'), false);

        $("#by-title").typeahead({ 
            name: 'titles',
            local: titles
        });

        $("#by-director").typeahead({ 
            name: 'directors',
            local: directors.sort()
        });

        $("#by-year").typeahead({ 
            name: 'years',
            local: years.sort()
        });

        // TODO: Location filter

        $('.typeahead').on('keypress', function(e) {
            var key = e.which;
            if (key === 13) this.close();  // select from dropdown on pressing 'enter'
        });
    }

    /**
     * Loop through the array of JSON objects. Instantiate a Marker model 
     * for each object, as well as a Google Maps infoWindow and marker class;
     * add to master collection allMarkers
     *
     * Outside of the for loop, instantiate a Backbone.View. Then populate
     * an array for each autcompletion field (Title, Director, Year).
     *
     * Map icons courtesy of http://mapicons.nicolasmollet.com/
     **/

    function setMarkers(data) {
        var SCENES = data.length;

        for (var i = 0; i < SCENES; i++) {
            var scene = data[i];

            /**
             * Instantiate a Backbone model for each object, add to allMarkers collection
             **/

            // Backbone.Model marker
            var newMarker = new Marker({
                title: scene['title'],
                id: i,
                year: scene['release_year'],
                director: scene['director'],
                mapMarker: new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(scene['latlong'][0], scene['latlong'][1]),
                    icon: 'static/images/star-3.png',
                    title: scene['title'],
                    visible: false,
                    zIndex: i
                }),
                infoWindow: new google.maps.InfoWindow({
                    content: "<div class='content'>" +
                            "<div id='siteNotice'>" + "</div>" +
                            "<h1 id='firstHeading' class='firstHeading'>" + 
                            scene['title'] + " (" + scene['release_year'] + ")</h1>" +
                            "<div id='bodyContent'>" +
                            "<p><span class='em'>Director: </span>" + scene['director'] + "</p>" +
                            "<p><span class='em'>Location: </span>" + scene['locations'] + "</p>" +
                            "</div>" + "</div>",
                    pixelOffset: new google.maps.Size(0,15)
                })
            });

            allMarkers.push(newMarker);
            
            var previousWindow;

            // bind infoWindow to its marker
            google.maps.event.addListener(allMarkers.get(i).attributes.mapMarker, 'click', function(index) {
                return function() {
                    if (previousWindow) previousWindow.close();  // auto-close any open infoWindow

                    var thisMarker = allMarkers.get(index).attributes;
                    thisMarker.infoWindow.open(map, thisMarker.mapMarker);
                    previousWindow = thisMarker.infoWindow;

                    google.maps.event.addListener(map, 'click', function() {
                        thisMarker.infoWindow.close();  // click away to close infoWindow
                    });
                }
            }(i));

            $('#nav-box').on('click', function() {
                if (previousWindow) previousWindow.close();
            });
        } 

        // instantiate Backbone view
        var markerView = new MarkerView({
            collection: allMarkers
        });

        loadAutocomplete(allMarkers);
    }

    // retrieve JSON data from server
    $.getJSON('static/js/geocoded.json', function(data) {
        setMarkers(data);
    });
}


function loadScript() {
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAAHAi7BkDviZMKVSG1hr4lSkEAW2EWM9g&sensor=false&callback=initialize";
    $('body').append(script);
}

$('document').ready(loadScript);
