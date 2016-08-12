var tracks = [];

function reloadTrackList(){
  $("#track-combo").empty();

  for(id in tracks){
    $("#track-combo").append('<option value="' + id + '">' + tracks[id].name + '</option>');
  }
}

function editTrack(){
  if(tracks.length > 0){
    var id = parseInt($("#track-combo").val());
    $("#track-name-text").val(tracks[id].name);
    $("#track-centerlat-text").val(tracks[id].centerLat);
    $("#track-centerlon-text").val(tracks[id].centerLon);

    for(var i = 0; i < tracks[id].waypoints.length; i++){
      console.log(tracks[id].waypoints[i].lat);
      console.log(tracks[id].waypoints[i].lon);  
    }

    setCenter(tracks[id].centerLat, tracks[id].centerLon);
    setZoom(17);

  }
}

function onCenterChanged(){
  var lat = parseFloat($("#track-centerlat-text").val());
  var lon = parseFloat($("#track-centerlon-text").val())

  if(!isNaN(lat) && !isNaN(lon)){
    setCenter(lat, lon);
  }
}

function checkCenterCoords(evt){
  evt = evt || window.event;
  var charCode = evt.keyCode || evt.which;
  var char = String.fromCharCode(charCode).charAt(0);

  if((char >= '0' && char <= '9') || char === '.'){
   return true;
  }
  return false;
}
