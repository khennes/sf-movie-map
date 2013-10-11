function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(37.775057, -122.419281),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    var input = document.getElementById('search-box');
    varSearchBox = new google.maps.places.SearchBox(input);
}

function loadScript() {
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAAHAi7BkDviZMKVSG1hr4lSkEAW2EWM9g&sensor=false&callback=initialize";
    document.body.appendChild(script);
}

window.onload = loadScript;

