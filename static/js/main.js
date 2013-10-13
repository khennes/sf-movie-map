/**
 * Render the map and initially display all markers
 **/

function initialize() {
 
    var geocoder = new google.maps.Geocoder();

    var mapOptions = {
        center: new google.maps.LatLng(37.775057, -122.419281),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var BOUNDS = new google.maps.LatLngBounds(new google.maps.LatLng(37.693601037244406, -122.51541137695312), new google.maps.LatLng(37.83419172060043, -122.35542297363281));
   
    
    /** 
     * Use Google Maps Geocoder service to get lat/lng
     * coords of first (assumed best) location search result;
     * construct a new Marker object for each scene
     *
     * Only items with a location property will be displayed
     **/

    function setMarker(i, data) {
        var scene = data[i];
        if (scene['locations']) {

            geocoder.geocode( { 'address': scene['locations'], 'bounds': BOUNDS }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

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

                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        title: 'Movie'
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infoWindow.open(map,marker);
                    });

                    console.log("marker at " + results[0].geometry.location + " aka " + scene['locations'] + " for " + scene['title']);

                } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    console.log("waiting...");
                    window.setTimeout(function() {}, 2000);

                } else {
                    console.log("Geocode was unsuccessful for " + scene['title'] + status);
                    console.log("Location: " + scene['locations']);
                }
            });
        }
    }


    /** 
     * Fetch array of JSON objects and assign each to a marker
     * Bias location results towards BOUNDS
     **/

    $.getJSON('static/js/data.json', function(data) {
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

function hideDrawer() {
    var navBox = document.getElementById('nav-box');
}


var Location = Backbone.Model.extend({
    defaults: {
        latitude: null,
        longitude: null,
        color: 'yellow'
      }
});

function loadScript() {
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAAHAi7BkDviZMKVSG1hr4lSkEAW2EWM9g&sensor=false&callback=initialize";
    document.body.appendChild(script);
}


window.onload = loadScript;
