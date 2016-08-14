var tracks = [];
var mode = "waypoints";
var currentTrackIndex = undefined;

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
          currentTrackIndex = undefined;
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
    currentTrackIndex = parseInt($("#track-combo").val());
    $("#track-name-text").val(tracks[currentTrackIndex].name);
    $("#track-centerlat-text").val(tracks[currentTrackIndex].center_lat);
    $("#track-centerlon-text").val(tracks[currentTrackIndex].center_lon);

    setCenter(parseFloat(tracks[currentTrackIndex].center_lat), parseFloat(tracks[currentTrackIndex].center_lon));
    setZoom(17);

    loadWaypoints(currentTrackIndex);
    loadPath(currentTrackIndex);

    if(mode === "waypoints"){
      hidePolyline();
    }
  }
}

function loadWaypoints(index){
  $("#waypoints-combo").empty();
  clearWaypoints();

  var waypoints = JSON.parse(tracks[index].waypoints);
  for(var i = 0; i < waypoints.length; i++){
    $("#waypoints-combo").append('<option value="' + waypoints[i].name + '">' + waypoints[i].name + '</option>');
    addWaypointToMap(waypoints[i].lat, waypoints[i].lng);
  }
}

function loadPath(index){
  setPolylinePath(JSON.parse(tracks[index].path));
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

function onCenterChanged(){
  var lat = parseFloat($("#track-centerlat-text").val());
  var lon = parseFloat($("#track-centerlon-text").val())

  if(!isNaN(lat) && !isNaN(lon)){
    setCenter(lat, lon);
  }
}

function setNewCenter(){
    setMapCursor('crosshair');
    setMapListener('click',
      function(event){
        var pos = event.latLng;
        $("#track-centerlat-text").val(pos.lat());
        $("#track-centerlon-text").val(pos.lng());
        setCenter(pos.lat(), pos.lng());
        removeMapListener('click');
        setMapCursor('');
      }
    );

    setMapListener('rightclick',
      function(){
        removeMapListener('click');
        setMapCursor('');
      }
    );
}

function enableWaypointsEditing(){
  mode = "waypoints";
  hidePolyline();
  showWaypoints();
  removeMapListener('click');
  setEnabled("#track-centerlat-text", true);
  setEnabled("#track-centerlon-text", true);
  setEnabled("#point-center-btn", true);
  setEnabled("#add-waypoint-btn", true);
  setEnabled("#remove-waypoint-btn", true);
  setEnabled("#go-waypoint-btn", true);
  setEnabled("#waypoints-combo", true);
}

function enablePathEditing(){
  mode = "path";
  showPolyline();
  hideWaypoints();
  setMapListener('click',
    function(event){
      poly.getPath().push(event.latLng);
    }
  );

  setEnabled("#track-centerlat-text", false);
  setEnabled("#track-centerlon-text", false);
  setEnabled("#point-center-btn", false);
  setEnabled("#add-waypoint-btn", false);
  setEnabled("#remove-waypoint-btn", false);
  setEnabled("#go-waypoint-btn", false);
  setEnabled("#waypoints-combo", false);
}

function showWaypoint(){
  if($("#waypoints-combo").has('option').length > 0){
    panToWaypoint($("#waypoints-combo option:selected").index());
  }
}

function addNewWaypoint() {
  setMapCursor('crosshair');
  setMapListener('click',
    function(event){
      var pos = event.latLng;
      var name = prompt("Please enter the waypoint name", "New Waypoint");

      if(name != null){
        addWaypointToMap(pos.lat(), pos.lng());
        $("#waypoints-combo").append('<option value="' + name + '">' + name + '</option>');
      }
      removeMapListener('click');
      setMapCursor('');
    }
  );

  setMapListener('rightclick',
    function(){
      removeMapListener('click');
      setMapCursor('');
    }
  );

}

function removeWaypoint() {
  var waypointsCount = $("#waypoints-combo").has('option').length;
  if(waypointsCount > 0){
    var index = $("#waypoints-combo option:selected").index()
    $("#waypoints-combo option:selected").remove();
    removeWaypointFromMap(parseInt(index));
  }
}

function save(){
  if(currentTrackIndex != undefined){
    var id = tracks[currentTrackIndex].id;
    var name = $("#track-name-text").val();
    var centerLat = parseFloat($("#track-centerlat-text").val());
    var centerLon = parseFloat($("#track-centerlon-text").val());
    var waypoints = [];
    var path = JSON.stringify(getPolylinePathArray());

    for(var i = 0; i < getWaypointsCount(); i++){
      waypoints.push(
        {
          name: $("#waypoints-combo option:nth-child(" + (i + 1) + ")").val(),
          lat: getWaypoint(i).getPosition().lat(),
          lng: getWaypoint(i).getPosition().lng()
        }
      );
    }
    waypoints = JSON.stringify(waypoints);

    var request = {};
    request['cmd'] = 'update';
    request['id'] = id;
    request['name'] = name;
    request['center_lat'] = centerLat;
    request['center_lon'] = centerLon;
    request['waypoints'] = waypoints;
    request['path'] = path;

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

    /*
    console.log(id);
    console.log(name);
    console.log(centerLat);
    console.log(centerLon);
    console.log(waypoints);
    console.log(path);
    */
  }
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
