function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
}

function loadScript() {
    var script = document.createElement("script");
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAAHAi7BkDviZMKVSG1hr4lSkEAW2EWM9g&sensor=false&callback=initialize";
    document.body.appendChild(script);
}

window.onload = loadScript;
