<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Map Manager</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

    <link rel="stylesheet" href="css/style.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.2/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAD9MxVhOWQBHC9FHkkLrBO45zrnRKj6ng"></script>
    <script src="js/map.js"></script>
    <script src="js/bootstrap_utils.js"></script>
    <script src="js/ui_interface.js"></script>
  </head>

  <body>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

    <script>
      <?php
        require('db_access.php');
        connectToDb();
      ?>

      $(function(){
        initMap();
        reloadTrackList();
      });
    </script>


    <div class="container-fluid">
      <div class="row">
         <div class="col-xs-3" id="gui-container">

           <div class="row">
             <div class="col-xs-7">
               <div class="form-group">
                 <label for="track-combo">Select a track:</label>
                 <select id="track-combo" class="form-control"></select>
               </div>
             </div>

             <div class="col-xs-5">
               <div class="form-group">
                 <label for="">&nbsp</label><br>
                 <div class="btn-group btn-group-sm">
                   <button type="button" class="btn btn-primary" onclick="addTrack();">
                     <span class="glyphicon glyphicon-plus"></span>
                   </button>
                   <button type="button" class="btn btn-primary" onclick="editTrack();">
                     <span class="glyphicon glyphicon-edit"></span>
                   </button>
                   <button type="button" class="btn btn-primary" onclick="removeTrack();">
                     <span class="glyphicon glyphicon-minus"></span>
                   </button>
                 </div>
               </div>
             </div>
           </div>

           <hr>

           <div class="row">
             <div class="col-xs-12">
               <div class="form-group">
                 <label for="track-name-text">Name:</label>
                 <input type="text" class="form-control" id="track-name-text">
               </div>
             </div>
           </div>

           <hr>

           <div class="row">
             <div class="col-xs-12">
               <label for="edit-waypoints-radio" class="radio-inline">
                 <input type="radio" id="edit-waypoints-radio" name="edit-type" onclick="enableWaypointsEditing()" checked>Way Points
               </label>

               <label for="edit-path-radio" class="radio-inline">
                 <input type="radio" id="edit-path-radio" name="edit-type" onclick="enablePathEditing()">Path
               </label>
             </div>
           </div>

           <hr>

           <div class="row">
             <div class="col-xs-4">
               <div class="form-group">
                 <label for="track-centerlat-text">Center Lat:</label>
                 <input type="text" class="form-control" id="track-centerlat-text" onchange="onCenterChanged()" onkeypress="return checkCenterCoords()">
               </div>
             </div>
             <div class="col-xs-4">
               <div class="form-group">
                 <label for="track-centerlon-text">Center Lon:</label>
                 <input type="text" class="form-control" id="track-centerlon-text" onchange="onCenterChanged()" onkeypress="return checkCenterCoords()">
               </div>
             </div>
             <div class="col-xs-2">
               <div class="form-group">
                 <label for="point-center-btn">Select</label>
                 <button type="button" id="point-center-btn" class="btn btn-primary" onclick="setNewCenter()">
                   <span class="glyphicon glyphicon-map-marker"></span>
                 </button>
              </div>
             </div>
           </div>

           <div class="row">
             <div class="col-xs-6">
               <label for="">Way Points:</label>
             </div>
             <div class="col-xs-6">
              <div class="btn-group btn-group-sm pull-right">
                <button type="button" id="add-waypoint-btn" class="btn btn-primary" onclick="addNewWaypoint()">
                  <span class="glyphicon glyphicon-plus"></span>
                </button>
                <button type="button" id="edit-waypoint-btn" class="btn btn-primary" onclick="editWaypoint()">
                  <span class="glyphicon glyphicon-edit"></span>
                </button>
                <button type="button" id="remove-waypoint-btn" class="btn btn-primary" onclick="removeWaypoint()">
                  <span class="glyphicon glyphicon-minus"></span>
                </button>
                <button type="button" id="go-waypoint-btn"  class="btn btn-primary" onclick="showWaypoint()">
                  Go
                </button>
              </div>
             </div>
           </div>

           <div class="row">
             <div class="col-xs-12">
               <select id="waypoints-combo" class="form-control">
               </select>
             </div>
           </div>

           <hr>

           <div class="row">
             <div class="col-xs-1">
             </div>
             <div class="col-xs-5">
               <button type="button" class="btn btn-primary fill" onclick="save()">Save</button>
             </div>
             <div class="col-xs-5">
               <button type="button" class="btn btn-primary fill" onclick="downloadCfg()">Download CFG</button>
             </div>
             <div class="col-xs-1">
             </div>
           </div>

         </div>

         <div id="map-container" class="col-xs-9">
         </div>

      </div>
    </div>

    <div class="modal fade" id="edit-waypoint-modal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="">Edit waypoint</h4>
          </div>
          <div class="modal-body">

            <div class="form-group">
              <label for="waypoint-name-text">Name:</label>
              <input type="text" class="form-control" id="waypoint-name-text">
            </div>

            <div class="form-group">
              <label for="waypoint-radius-spin">Radius(m):</label>
              <input type="number" class="form-control" id="waypoint-radius-spin" min="1" max="100" value="1">
            </div>

            <div class="form-group">
              <label for="waypoint-space-spin">Space(m):</label>
              <input type="number" class="form-control" id="waypoint-space-spin" min="0" max="100" value="0">
            </div>

            <div class="form-group">
              <label for="waypoint-time-spin">Time(s):</label>
              <input type="number" class="form-control" id="waypoint-time-spin" min="1" max="100" value="1">
            </div>

            <div class="checkbox">
              <label><input type="checkbox" id="waypoint-ref-check" checked="">Is reference</label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" onclick="saveWaypoint()">Save</button>
          </div>
        </div>
      </div>
    </div>

    <?php
      disconnectFromDb();
    ?>

  </body>
</html>
