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


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Retrieving all the avaliable dates within time period


$date = filter_input(INPUT_POST, "date");
$chosen = filter_input(INPUT_POST, "chosen");
$db = connect_db();

if(!$date){
    send(400, ["error" => "Invalid date!"]);
    exit;
}

if(!$chosen){
    send(400, ["error" => "Representative not chosen"]);
    exit;
}

$split_name = explode(' ', $chosen);
$query = $db->prepare("SELECT `id` FROM `users` WHERE `first_name` = ? AND `last_name` = ?");
$query->execute([$split_name[0],$split_name[1]]);

$representative_id = $query->fetch();

if(!$representative_id){
    send(400, ["error" => "Representative ID not found"]);
    exit;
}

$id_value = $representative_id['id'];

$new_date = new DateTime($date);
$dayOfWeek = $new_date->format('w');

$query = $db->prepare("
SELECT availability.start_time, availability.end_time,users.first_name, users.last_name
FROM availability INNER JOIN representatives ON representatives.user_id = availability.representative
INNER JOIN users ON users.id = representatives.user_id WHERE availability.day_of_week = ? AND representatives.id = ? 
AND NOT EXISTS (
    SELECT id
    FROM meetings 
    WHERE representative = representatives.id
    AND day_of_week = availability.day_of_week 
    AND TIME(start_time) = availability.start_time
    AND TIME(end_time) = availability.end_time
)");

$query->execute([$dayOfWeek, $id_value]);

$all = [];

while($test = $query->fetch()){
    $thing = [
        "full_name" => $chosen,
        "start_time" => $test["start_time"],
        "end_time" => $test["end_time"]
    ];

    array_push($all, $thing);

}

send(200, $all); 
?>