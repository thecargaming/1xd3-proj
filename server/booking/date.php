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
//      string chosen (representative id)


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";




// Retrieving all the avaliable dates within time period


$date = filter_input(INPUT_POST, "date");
$chosen = filter_input(INPUT_POST, "chosen", FILTER_VALIDATE_INT);
$db = connect_db();

if(!$date){
    send(400, ["error" => "Invalid date!"]);
    exit;
}

if(!$chosen){
    send(400, ["error" => "Representative not chosen"]);
    exit;
}

$new_date = new DateTime($date);
$dayOfWeek = $new_date->format('w');

$query = $db->prepare("
SELECT availability.start_time,availability.end_time,CONCAT(users.first_name, ' ', users.last_name) as name FROM availability
INNER JOIN representatives ON representatives.id = availability.representative
INNER JOIN users ON users.id = representatives.user_id
WHERE availability.day_of_week = ?
AND representatives.id = ?
AND (
    SELECT COUNT(*) FROM meetings
    INNER JOIN representatives AS rep ON meetings.representative=rep.id
    WHERE (meetings.client=users.id OR rep.user_id=users.id)
    AND CONVERT(CONCAT(?, availability.start_time), DATETIME) < meetings.end_time
    AND CONVERT(CONCAT(?, availability.end_time), DATETIME) > meetings.start_time
    ) = 0
    ");

$query->execute([$dayOfWeek, $chosen, "$date ", "$date "]);

$all = [];

while($test = $query->fetch()){
    $thing = [
        "full_name" => $test["name"],
        "start_time" => $test["start_time"],
        "end_time" => $test["end_time"],
        "id" => $chosen,
    ];

    array_push($all, $thing);
}

send(200, $all); 
?>
