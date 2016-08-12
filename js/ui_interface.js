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

    loadWaypoints(id);
    loadPath(id);

    setCenter(tracks[id].centerLat, tracks[id].centerLon);
    setZoom(17);
  }
}

function loadWaypoints(id){
  $("#waypoints-combo").empty();
  clearWaypoints();
  for(var i = 0; i < tracks[id].waypoints.length; i++){
    $("#waypoints-combo").append('<option value="' + i + '">Waypoint ' + i + '</option>');
    addWayPoint(tracks[id].waypoints[i].lat, tracks[id].waypoints[i].lon);
  }
}

function loadPath(id){
  setPolylinePath(tracks[id].path);
}

function enableWaypointsEditing(){
  hidePolyline();
  setEnabled("#add-waypoint-btn", true);
  setEnabled("#remove-waypoint-btn", true);
  setEnabled("#edit-waypoint-btn", true);
  setEnabled("#go-waypoint-btn", true);
  setEnabled("#waypoints-combo", true);
}

function enablePathEditing(){
  showPolyline();
  setEnabled("#add-waypoint-btn", false);
  setEnabled("#remove-waypoint-btn", false);
  setEnabled("#edit-waypoint-btn", false);
  setEnabled("#go-waypoint-btn", false);
  setEnabled("#waypoints-combo", false);
}

function showWaypoint(){
  if($("#waypoints-combo").has('option').length > 0){
    panToWaypoint($("#waypoints-combo").val());
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
