google.maps.visualRefresh = true;	
	
var map;
var coordsType = 'd';

function initialize() {
	var mapOptions = {
	zoom: 10,
	center: new google.maps.LatLng(33.450, -112.0667),
	draggableCursor: 'default',
	styles:
	[	
	  {
		"featureType": "poi",
		"stylers": [
		  { "visibility": "off" }
		]
	  }
	]
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
	  mapOptions); 	

	google.maps.event.addListener(map, 'click', function(event) {
		placeCircle(event.latLng);
	});

	
	DisplayCoords();
	google.maps.event.addListener(map, 'center_changed', DisplayCoords);
	
	var div = map.getDiv();
    var crosshairs = document.createElement("img");
    crosshairs.src = './source/crosshairs.gif';
    crosshairs.style.width = 19 + 'px';
    crosshairs.style.height = 19 + 'px';
    crosshairs.style.border = '0';
    crosshairs.style.position = 'relative';
    crosshairs.style.top = ( ( div.clientHeight - 19) / 2 ) + 'px';
    crosshairs.style.left = ( ( div.clientWidth - 19) / 2 ) + 'px';
    crosshairs.style.zIndex = '500';
	crosshairs.onclick = circleAtCenter;
    div.appendChild(crosshairs);	
}

function circleAtCenter() {
	placeCircle(map.getCenter());
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
			strokeOpacity: 0.10,
			strokeWeight: 1,
			fillColor: color,
			fillOpacity: 0.10,
			map: map,
			center: location,
			radius: radius,
			clickable: true,
		};	
	newCircle = new google.maps.Circle(circle);	
	google.maps.event.addListener(newCircle, 'rightclick', function(event) {
		this.marker.setMap(null);
        this.setMap(null);
    });
	google.maps.event.addListener(newCircle, 'click', function(event) {
		placeCircle(event.latLng);
	});
		
	var marker = new google.maps.Marker({
		position: newCircle.center,
		map: map,
		title: document.getElementById("tag").value,
	});
	marker.circle = newCircle;
	
	google.maps.event.addListener(marker, 'rightclick', function(event) {
		this.circle.setMap(null);
        this.setMap(null);
	});
	
	newCircle.marker = marker;
}

function OptionsChanged() {
	coordsType = document.getElementById("type").value;
	DisplayCoords()
}

function DisplayCoords() {
	document.getElementById("latlong").innerHTML = FormatCoords(map.getCenter());
}

function FormatCoords( p ) {
	var ew = ( p.lng() >= 0 ? 'E' : 'W' );
	var ns = ( p.lat() >= 0 ? 'N' : 'S' );
	var absx = Math.abs( p.lng() );
	var absy = Math.abs( p.lat() );
	var intdegx = Math.floor( absx );
	var intdegy = Math.floor( absy );
	var minx = ( absx - intdegx ) * 60;
	var miny = ( absy - intdegy ) * 60;
	var intminx = Math.floor( minx );
	var intminy = Math.floor( miny );
	var secx = ( minx - intminx ) * 60;
	var secy = ( miny - intminy ) * 60;
	var intsecx = Math.floor( secx );
	var intsecy = Math.floor( secy );
	switch ( coordsType )
	{
		case 'numeric':
			return p.lat().toFixed(5) + ' ' + p.lng().toFixed(5);
		case 'd':
			return ns + ' ' + absy.toFixed(5) + ' ' + ew + ' ' + absx.toFixed(5);
		case 'dm':
			return ns + ' ' + intdegy + ' ' + miny.toFixed(3) + "' " + ew + ' ' + intdegx + ' ' + minx.toFixed(3) + "'";
		case 'dms':
			return ns + ' ' + intdegy + ' ' + intminy + "' " + intsecy + '" ' + ew + ' ' + intdegx + ' ' + intminx + "' " + intsecx + '"';			
		default:
			return '&nbsp;';
	}
}

google.maps.event.addDomListener(window, 'load', initialize);
