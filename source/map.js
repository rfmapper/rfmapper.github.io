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
	var unitArray = [3963.1676,6378.1,6378100];
	var radius = parseFloat(document.getElementById("radius").value);
	var selectedUnit = document.getElementById("units").selectedIndex;
	radius = radius / unitArray[selectedUnit] * unitArray[2];
	var color = document.getElementById("color").value;
	
	var circle = {
			strokeColor: color,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: color,
			fillOpacity: 0.35,
			map: map,
			center: location,
			radius: radius,
			clickable: true,
		};	
	newCircle = new google.maps.Circle(circle);	
	google.maps.event.addListener(newCircle, 'rightclick', function(event) {
        this.setMap(null);
    });
	google.maps.event.addListener(newCircle, 'click', function(event) {
		placeCircle(event.latLng);
	});

}
google.maps.event.addDomListener(window, 'load', initialize);
