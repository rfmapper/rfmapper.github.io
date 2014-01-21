google.maps.visualRefresh = true;	
	
var map;
function initialize() {
	var mapOptions = {
	zoom: 10,
	center: new google.maps.LatLng(33.450, -112.0667)
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
	  mapOptions); 

	google.maps.event.addListener(map, 'click', function(event) {
		placeCircle(event.latLng);
	});
}
function placeCircle(location) {
	var pos = new google.maps.LatLng(location);
	var circle = {
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: map,
			center: location,
			radius: 3900,
			clickable: true,
		};	
	newCircle = new google.maps.Circle(circle);	
	google.maps.event.addListener(newCircle, 'rightclick', function(event) {
        this.setMap(null);
    });
}
google.maps.event.addDomListener(window, 'load', initialize);
