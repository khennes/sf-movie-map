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

    var MasterCollection = Backbone.Collection.extend({
        model: Marker
    });

    var FilterCollection = Backbone.Collection.extend({
        model: Marker
    });


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
                "</div>" +
                "</div>";

            if (scene['fun_facts']) {
                var funFact = "<p>Fun fact: " + scene['fun_facts'] + "</p>";
                contentString += funFact;
            }
                
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
                icon: 'static/js/star-3.png'
            });

            //MasterCollection.push([
            //        { title: scene['title'],
            //          id: i,
            //          year: scene['release_year'],
            //          director: scene['director'],
            //          position: new google.maps.LatLng(scene['latlong']),
            //          position: scene['latlong'] }
            //]);

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(map,marker);
            });
        }
    }


    /** 
     * Fetch array of geocoded JSON objects and call setMarker() on each; 
     * Bias location results towards BOUNDS
     **/

    $.getJSON('static/js/geocoded.json', function(data) {
        var SCENES = data.length;
        for (var i = 0; i < SCENES; i++) {
            setMarker(i, data);
        }
    });
}

// explicit marker set/remove (not when constructed)
// use this for filtering view
// marker.setMap(map);
// marker.setMap(null);


function loadScript() {
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAAHAi7BkDviZMKVSG1hr4lSkEAW2EWM9g&sensor=false&callback=initialize";
    document.body.appendChild(script);
}

window.onload = loadScript;
