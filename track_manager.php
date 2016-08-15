<?php
  require('db_access.php');
  define('PROPS_PER_CHANNEL', 6);

  connectToDb();

  $request = json_decode($_POST['request']);
  $response = array();

  if($request->cmd === 'get_all'){
    $sql = 'SELECT * FROM track ORDER BY id ASC';
    $result = $conn->query($sql);

    $tracks = array();
    while($row = $result->fetch_assoc()) {
        $tracks[] = $row;
    }

    $response['result'] = 'ok';
    $response['tracks'] = $tracks;

  }
  else if($request->cmd === 'add'){
    $sql = 'INSERT INTO track VALUES(NULL, "New track", 0, 0, "[]", "[]")';
    if($conn->query($sql) === TRUE){
      $response['result'] = 'ok';
    }
    else{
      $response['result'] = 'error';
      $response['error'] = $conn->error;
    }
  }
  else if($request->cmd === 'update'){
    $sql = 'UPDATE track SET name = "' . $request->name . '", ' .
                             'center_lat = ' . $request->center_lat . ', ' .
                             'center_lon = ' . $request->center_lon . ', ' .
                             'waypoints = \'' . $request->waypoints . '\', ' .
                             'path = \'' . $request->path . '\' ' .
                             'WHERE id = ' . $request->id;
    if($conn->query($sql) === TRUE){
     $response['result'] = 'ok';
    }
    else{
     $response['result'] = 'error';
     $response['error'] = $conn->error;
    }
  }
  else if($request->cmd === 'remove'){
    $sql = 'DELETE FROM track WHERE id = ' . $request->id;
    if($conn->query($sql) === TRUE){
      $response['result'] = 'ok';
    }
    else{
      $response['result'] = 'error';
      $response['error'] = $conn->error;
    }
  }
  else if($request->cmd === 'download'){
    $sql = 'SELECT waypoints FROM track WHERE id = ' . $request->id;
    $result = $conn->query($sql);

    if($row = $result->fetch_assoc()){
      $waypoints = (array)json_decode($row['waypoints']);
      $waypoints_count = count($waypoints);

      $response['result'] = 'ok';
      $response['cfg'] = 'PROPS=' . $waypoints_count * PROPS_PER_CHANNEL;

      for($i = 0; $i < count($waypoints); $i++){
        $response['cfg'] .=  PHP_EOL . "###" . $waypoints[$i]->name . "###" . PHP_EOL;
        $response['cfg'] .= "LAT=" . $waypoints[$i]->lat . PHP_EOL;
        $response['cfg'] .= "LON=" . $waypoints[$i]->lng . PHP_EOL;
        $response['cfg'] .= "RADIUS=" . $waypoints[$i]->radius . PHP_EOL;
        $response['cfg'] .= "SPACE=" . $waypoints[$i]->space . PHP_EOL;
        $response['cfg'] .= "TIME=" . $waypoints[$i]->time . PHP_EOL;
        $response['cfg'] .= "REF=" . ($waypoints[$i]->ref ? "1" : "0");
      }
    }else{
      $response['result'] = 'error';
      $response['error'] = $conn->error;
    }
  }

  print json_encode($response);

  disconnectFromDb();
?>
