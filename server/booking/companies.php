<?php

// Name:    Ahyan Khan
// Date:    2025-04-22
//
// Purpose:
//      Selecting the avaliable time slots
//      with the constraints of already booked 
//      meetings and the representative and 
//      company in mind
// Method: POST
// Parameters
//      string date
//      string chosen (representative)


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

$db = connect_db();
$user_id = get_user_id($db);


if(!$user_id){
    send(401,["msg"=>"not logged in"]);
}


$query = $db->prepare("
    SELECT name FROM companies
");

$query->execute();

$array = [];

while($choice = $query->fetch()){
    $thing = [
        "name" => $choice["name"]
    ];

    array_push($array, $thing);
}

send(200, $array);
?>