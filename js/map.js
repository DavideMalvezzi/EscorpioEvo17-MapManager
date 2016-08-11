var map;
var poly;

function initMap() {
  map = new google.maps.Map(document.getElementById('map-container'), {
    zoom: 2,
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
}
