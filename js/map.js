var map;
var poly;
var center;

function initMap() {
  map = new google.maps.Map(document.getElementById('map-container'), {
    zoom: 2,
    mapTypeId: 'satellite',
    streetViewControl: false,
    center: {lat: 0, lng: 0}
  });

  poly = new google.maps.Polyline({
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3,
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
