var tracks = [];
var mode = "waypoints";

function reloadTrackList(){
  var request = {};
  request['cmd'] = 'get_all';

  $("#track-combo").empty()

  ajaxRequest(request,
    function(response){
      if(response.result === 'ok'){
        tracks = response.tracks;
        for(var i = 0; i < tracks.length; i++){
          $("#track-combo").append('<option value="' + i + '">' + tracks[i].name + '</option>');
        }
      }
      else{
        console.log(response.error);
      }
    }
  );
}

function addTrack(){
  var request = {};
  request['cmd'] = 'add';

  ajaxRequest(request,
    function(response){
      if(response.result === 'ok'){
        reloadTrackList();
      }
      else{
        console.log(response.error);
      }
    }
  );
}

function removeTrack(){
  if(tracks.length > 0){
    var request = {};
    request['cmd'] = 'remove';
    request['id'] = tracks[parseInt($("#track-combo").val())].id;

    ajaxRequest(request,
      function(response){
        if(response.result === 'ok'){
          reloadTrackList();
        }
        else{
          console.log(response.error);
        }
      }
    );
  }
}

function editTrack(){
  if(tracks.length > 0){
    var index = parseInt($("#track-combo").val());
    $("#track-name-text").val(tracks[index].name);
    $("#track-centerlat-text").val(tracks[index].center_lat);
    $("#track-centerlon-text").val(tracks[index].center_lon);

    loadWaypoints(index);
    loadPath(index);

    if(mode === "waypoints"){
      hidePolyline();
    }

    setCenter(parseFloat(tracks[index].center_lat), parseFloat(tracks[index].center_lon));
    setZoom(17);
  }
}

function loadWaypoints(index){
  $("#waypoints-combo").empty();
  clearWaypoints();

  var waypoints = JSON.parse(tracks[index].waypoints);
  for(var i = 0; i < waypoints.length; i++){
    $("#waypoints-combo").append('<option value="' + i + '">Waypoint ' + i + '</option>');
    addWayPoint(waypoints[i].lat, waypoints[i].lon);
  }
}

function loadPath(index){
  setPolylinePath(JSON.parse(tracks[index].path));
}

function enableWaypointsEditing(){
  mode = "waypoints";
  hidePolyline();
  showWaypoints();
  setEnabled("#add-waypoint-btn", true);
  setEnabled("#remove-waypoint-btn", true);
  setEnabled("#go-waypoint-btn", true);
  setEnabled("#waypoints-combo", true);
}

function enablePathEditing(){
  mode = "path";
  showPolyline();
  hideWaypoints();
  setEnabled("#add-waypoint-btn", false);
  setEnabled("#remove-waypoint-btn", false);
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

function ajaxRequest(request, callback){
  $.ajax({
      type: 'post',
      url: 'track_manager.php',
      dataType: 'json',
      data: {'request' : JSON.stringify(request)},
      success: callback
  });
}
