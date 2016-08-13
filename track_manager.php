<?php
  require('db_access.php');

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
  else if($request->cmd === 'edit'){

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

  print json_encode($response);

  disconnectFromDb();
?>
