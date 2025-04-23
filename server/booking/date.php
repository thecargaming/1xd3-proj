<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

// Retrieving all the avaliable dates within time period


$date = filter_input(INPUT_POST, "date", FILTER_SANITIZE_SPECIAL_CHARS);
$chosen = filter_input(INPUT_POST, "chosen");
$db = connect_db();

if(!$date){
    send(400, ["error" => "Invalid date!"]);
    exit;
}

if(!$chosen){
    send(400, ["error" => "Representative not chosen"]);
}

$split_name = explode(' ', $name);
$query = $db->prepare("SELECT `user_id`, FROM `representative` WHERE `first_name` = ?, `last_name` = ?");
$query->execute([$split_name[0],$split_name[1]]);

$representative_id = $query->fetch();


$new_date = new DateTime($date);
$dayOfWeek = $new_date->format('w');

$query = $db->prepare("
    SELECT avaliability.start_time, avaliability.end_time,users.first_name,users.last_name
    FROM avaliability
    INNER JOIN representatives ON representatives.userid = avaliability.representative
    INNER JOIN users ON user.id = representatives.user_id
    WHERE day_of_week = ?
    AND representatives = ?
");

$query->execute([$dayOfWeek. $representative_id]);

$all = [];

while($test = $query->fetch()){
    $thing = [
        "full_name" => $test["name"],
        "start_time" => $test["start_time"],
        "end_time" => $test["end_time"]
    ];

    array_push($all, $thing);

}

send(200, $all); // need to check if send function doing json
?>