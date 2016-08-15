var tracks = [];
var mode = "waypoints";
var currentTrackIndex = undefined;
var currentWaypointIndex = undefined;

function reloadTrackList(doAfter){
  var request = {};
  request['cmd'] = 'get_all';

  $("#track-combo").empty()

  ajaxRequest(request,
    function(response){
      if(response.result === 'ok'){
        tracks = response.tracks;
        for(var i = 0; i < tracks.length; i++){
          $("#track-combo").append('<option value="' + i + '">' + tracks[i].name + '</option>');
          tracks[i].waypoints = JSON.parse(tracks[i].waypoints);
        }
        if(doAfter !== undefined){
          doAfter();
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
        reloadTrackList(
          function(){
            $("#track-combo :nth-child(" + tracks.length + ")").attr("selected", "selected");
          }
        );
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
          currentWaypointIndex = undefined;
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

  for(var i = 0; i < tracks[index].waypoints.length; i++){
    $("#waypoints-combo").append('<option value="' + tracks[index].waypoints[i].name + '">' + tracks[index].waypoints[i].name + '</option>');
    addWaypointToMap(tracks[index].waypoints[i].lat, tracks[index].waypoints[i].lng);
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
  setEnabled("#edit-waypoint-btn", true);
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
  setEnabled("#edit-waypoint-btn", false);
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
  if(currentTrackIndex !== undefined){
    setMapCursor('crosshair');
    setMapListener('click',
      function(event){
        var pos = event.latLng;

        tracks[currentTrackIndex].waypoints.push({name:"New", lat: pos.lat(), lng: pos.lng(), radius: 1, space: 1, time: 1, ref: true});
        currentWaypointIndex = tracks[currentTrackIndex].waypoints.length - 1;

        $("#waypoints-combo").append('<option value="New">New</option>');
        addWaypointToMap(pos.lat(), pos.lng());

        showEditWaypointModal();

      }
    );

    setMapListener('rightclick',
      function(){
        removeMapListener('click');
        setMapCursor('');
      }
    );
  }
}

function removeWaypoint() {
  var waypointsCount = $("#waypoints-combo").has('option').length;
  if(waypointsCount > 0){
    var index = $("#waypoints-combo option:selected").index();
    tracks[currentTrackIndex].waypoints.splice(index, 1);
    $("#waypoints-combo option:selected").remove();
    removeWaypointFromMap(parseInt(index));
  }
}

function showEditWaypointModal(){
  setError("#waypoint-name-text", false);

  $("#waypoint-name-text").val("New Waypoint");
  $("#waypoint-radius-spin").val(1);
  $("#waypoint-space-spin").val(1);
  $("#waypoint-time-spin").val(1);
  $("#waypoint-ref-check").attr("checked", "checked");

  $('#edit-waypoint-modal').modal(
    {
      backdrop: 'static',
      keyboard: false
    }
  );
}

function saveWaypoint(){
  var name = $("#waypoint-name-text").val().replace(/\s+/g, '');
  var radius = $("#waypoint-radius-spin").val();
  var space = $("#waypoint-space-spin").val();
  var time = $("#waypoint-time-spin").val();
  var isRef = $("#waypoint-ref-check").attr("checked") === "checked";

  if(name.length == 0){
    setError("#waypoint-name-text", true);
    return;
  }

  tracks[currentTrackIndex].waypoints[currentWaypointIndex].name = name;
  tracks[currentTrackIndex].waypoints[currentWaypointIndex].radius = radius;
  tracks[currentTrackIndex].waypoints[currentWaypointIndex].space = space;
  tracks[currentTrackIndex].waypoints[currentWaypointIndex].time = time;
  tracks[currentTrackIndex].waypoints[currentWaypointIndex].ref = isRef;

  $("#waypoints-combo :nth-child(" + (currentWaypointIndex + 1) + ")").val(name);
  $("#waypoints-combo :nth-child(" + (currentWaypointIndex + 1) + ")").text(name);
  $("#waypoints-combo :nth-child(" + (currentWaypointIndex + 1) + ")").attr("selected", "selected");

  $('#edit-waypoint-modal').modal('hide');

  removeMapListener('click');
  setMapCursor('');
}

function editWaypoint(){
  currentWaypointIndex = $("#waypoints-combo option:selected").index();

  if(currentWaypointIndex != -1){
    showEditWaypointModal();

    $("#waypoint-name-text").val(tracks[currentTrackIndex].waypoints[currentWaypointIndex].name);
    $("#waypoint-radius-spin").val(tracks[currentTrackIndex].waypoints[currentWaypointIndex].radius);
    $("#waypoint-space-spin").val(tracks[currentTrackIndex].waypoints[currentWaypointIndex].space);
    $("#waypoint-time-spin").val(tracks[currentTrackIndex].waypoints[currentWaypointIndex].time);
    $("#waypoint-ref-check").attr("checked", tracks[currentTrackIndex].waypoints[currentWaypointIndex].ref ? "checked" : "");
  }
}


function save(){
  if(currentTrackIndex != undefined){
    var id = tracks[currentTrackIndex].id;
    var name = $("#track-name-text").val();
    var centerLat = parseFloat($("#track-centerlat-text").val());
    var centerLon = parseFloat($("#track-centerlon-text").val());
    var waypoints;

    for(var i = 0; i < getWaypointsCount(); i++){
      tracks[currentTrackIndex].waypoints[i].lat = getWaypoint(i).getPosition().lat();
      tracks[currentTrackIndex].waypoints[i].lng = getWaypoint(i).getPosition().lng();
    }
    waypoints = JSON.stringify(tracks[currentTrackIndex].waypoints);

    var path = JSON.stringify(getPolylinePathArray());


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
          reloadTrackList(
            function(){
              $("#track-combo :nth-child(" + (currentTrackIndex + 1) + ")").attr("selected", "selected");
            }
          );
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

function downloadCfg(){
  if(currentTrackIndex !== undefined){
    var request = {};
    request['cmd'] = 'download';
    request['id'] = tracks[currentTrackIndex].id;
    ajaxRequest(request,
      function(response){
        if(response.result === 'ok'){
          var properties = {type: 'plain/text'};
          var file = new File([response.cfg], "GPS.CFG", properties);
          var link = document.createElement("a");
          link.download = "GPS.CFG";
          link.href = URL.createObjectURL(file);
          link.click();
        }
        else{
          console.log(response.error);
        }
      }
    );
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
