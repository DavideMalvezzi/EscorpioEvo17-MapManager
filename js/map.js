var map;
var poly;
var center;
var waypoints = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map-container'), {
    zoom: 2,
    mapTypeId: 'satellite',
    streetViewControl: false,
    center: {lat: 0, lng: 0}
  });

  poly = new google.maps.Polyline({
    map: map,
    geodesic: true,
    strokeColor: '#ff0000',
    strokeOpacity: 1,
    strokeWeight: 5,
    editable: true
  });

  poly.setMap(map);

  $("#map-container").height($(window).height());

  google.maps.event.addListener(poly, 'rightclick',
    function(e) {
      if (e.vertex !== undefined) {
        poly.getPath().removeAt(e.vertex);
      }
    }
  );

  center = new google.maps.Marker({
      position: {lat: 0, lng: 0},
      map: map,
      title: 'Center'
    });
}

function setMapListener(eventName, callback){
  map.addListener(eventName, callback);
}

function removeMapListener(eventName){
  google.maps.event.clearListeners(map, eventName);
}

function setMapCursor(name){
  map.setOptions({ draggableCursor: name });
}

function setCenter(lat, lon){
  center.setPosition({lat: lat, lng: lon});
  panTo(new google.maps.LatLng(lat, lon));
}

function panTo(pos){
  map.panTo(pos);
}

function setZoom(zoom){
  map.setZoom(zoom);
}


function clearWaypoints(){
  for(var i = 0; i < waypoints.length; i++){
    waypoints[i].setMap(null);
  }
  waypoints.splice(0, waypoints.length);
}

function addWaypointToMap(lat, lon){
  waypoints.push(new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: map,
        title: 'Center',
        draggable: true
    })
  );
}

function removeWaypointFromMap(index){
  waypoints[index].setMap(null);
  waypoints.splice(index, 1);
}

function panToWaypoint(index){
  map.setCenter(waypoints[index].getPosition());
}

function hideWaypoints(){
  for(var i = 0; i < waypoints.length; i++){
    waypoints[i].setVisible(false);
  }
}

function showWaypoints(){
  for(var i = 0; i < waypoints.length; i++){
    waypoints[i].setVisible(true);
  }
}

function getWaypoint(index){
  return waypoints[index];
}

function getWaypointsCount(){
  return waypoints.length;
}

function setPolylinePath(path){
  poly.setPath(path);
}

function hidePolyline(){
  poly.setVisible(false);
}

function showPolyline(){
  poly.setVisible(true);
}

function getPolylinePathArray(){
  return poly.getPath().getArray();
}
