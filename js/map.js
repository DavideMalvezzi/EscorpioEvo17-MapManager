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

  //map.addListener('click', addLatLng);

  /*
  google.maps.event.addListener(poly, 'rightclick',
    function(e) {
      if (e.vertex !== undefined) {
        poly.getPath().removeAt(e.vertex);
      }
    }
  );
  */

  center = new google.maps.Marker({
      position: {lat: 0, lng: 0},
      map: map,
      title: 'Center'
    });

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

function addWayPoint(lat, lon){
  waypoints.push(new google.maps.Marker({
        position: {lat: lat, lng: lon},
        map: map,
        title: 'Center'
    })
  );
}

function panToWaypoint(index){
  map.setCenter(waypoints[index].getPosition());
}

function setPolylinePath(path){
  poly.setPath(path);
}

function hidePolyline(){
  poly.setMap(null);
}

function showPolyline(){
  poly.setMap(map);
}
