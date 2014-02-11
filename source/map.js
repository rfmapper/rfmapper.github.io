google.maps.visualRefresh = true;	
	
var map;
var coordsType = 'd';

var maxMarkers = 50;
var markers = [];
var markerNamePrefix = 'marker';

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
	
	GetMarkersFromCookies();
	GetCoordsFromCookies();
}

function GetMarkersFromCookies() {
	for (var i = 0; i < maxMarkers; i++) {
		var markerName = markerNamePrefix + i;
		var markerValue = GetMarkerValue(markerName);
		
		if (markerValue != null) {
			LoadMarker(markerValue);
		}
	}
}

function GetCoordsFromCookies() {
	try {
		var value = localStorage["coords"];
		if (value)
		{
			coordsType = value;
		}
	}
	catch(e) {
	}
	
	document.getElementById("type").value = coordsType;
	DisplayCoords();
}

function SaveCoords() {
	try {
		localStorage["coords"] = coordsType;
	}
	catch(e) {
	}
}

function GetMarkerValue(markerName) {
	try {
		var value = localStorage[markerName];
		if (value) {
			return value;
		}
	}
	catch(e) {
	}
}

function LoadMarker(markerValue) {
	var parts = markerValue.split("|");
	var lat = parts[0];
	var lng = parts[1];
	var pos = new google.maps.LatLng(lat,lng);
	var radius = parseFloat(parts[2]);
	var color = parts[3];
	var tag = parts[4];	
	
	createCircleAndMarker(color, pos, radius, tag);			
}

function SaveMarkers() {
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i];
		var markerValue = marker.getPosition().lat().toFixed(5) + '|' + marker.getPosition().lng().toFixed(5) + '|' + marker.radius + '|' + marker.color + '|' + marker.title;
		
		try {
			localStorage[markerNamePrefix + i] = markerValue;
		}
		catch(e) {
		}
	}	
}

function ClearCookies(){
	var beginningOfTime='Thu, 01-Jan-1970 00:00:00 GMT';	
	for (var i = 0; i < maxMarkers; i++) {
		var markerName = markerNamePrefix + i;
		try {
			delete localStorage[markerName];
		}
		catch(e) { 
		}
		document.cookie=markerName+'=; path=/; expires='+beginningOfTime;
	}
}

function ClearMarkers() {	
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
		markers[i].circle.setMap(null);
	}
	markers.length = 0;
	
	ClearCookies();
}

function circleAtCenter() {
	placeCircle(map.getCenter());
}

function placeCircle(location) {
	if (markers.length < maxMarkers) {
		var unitArray = [3963.1676,6378.1,6378100];
		var radius = parseFloat(document.getElementById("radius").value);
		var selectedUnit = document.getElementById("units").selectedIndex;
		radius = radius / unitArray[selectedUnit] * unitArray[2];
		var color = document.getElementById("color").value;	
		var tag = document.getElementById("tag").value;
		
		createCircleAndMarker(color, location, radius, tag);		
		SaveMarkers();
	}
}

function createCircleAndMarker(color, pos, radius, tag) {
	var circle = {
		strokeColor: color,
		strokeOpacity: 0.10,
		strokeWeight: 1,
		fillColor: color,
		fillOpacity: 0.10,
		map: map,
		center: pos,
		radius: radius,
		clickable: true,
	};	
	newCircle = new google.maps.Circle(circle);	
	google.maps.event.addListener(newCircle, 'rightclick', function(event) {
		var index = $.inArray(this.marker, markers)
		markers[index].setMap(null);
		markers.splice(index, 1);			
		this.setMap(null);
		
		ClearCookies();
		SaveMarkers();
	});
	google.maps.event.addListener(newCircle, 'click', function(event) {
		placeCircle(event.latLng);
	});
		
	var marker = new google.maps.Marker({
		position: newCircle.center,
		map: map,
		title: tag,
	});
	marker.circle = newCircle;
	marker.color = newCircle.fillColor,
	marker.radius = newCircle.radius,
	
	google.maps.event.addListener(marker, 'rightclick', function(event) {
		this.circle.setMap(null);
		
		var index = $.inArray(this, markers)
		markers[index].setMap(null);
		markers.splice(index, 1);
					
		ClearCookies();
		SaveMarkers();
	});		
	newCircle.marker = marker;		
	markers.push(marker);
}

function OptionsChanged() {
	coordsType = document.getElementById("type").value;
	DisplayCoords();	
	SaveCoords();
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
