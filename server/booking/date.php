<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

// Retrieving all the avaliable dates within time period


$date = filter_input(INPUT_POST, "date", FILTER_SANITIZE_SPECIAL_CHARS);
$db = connect_db();

if(!$date){
    send(400, ["error" => "Invalid date!"]);
    exit;
}

$query = $db->prepare("SELECT `start_time`, `end_time` FROM `avaliability` WHERE `day_of_week` = ?");
$query->execute([$date]);

$all = [];

while($test = $query->fetch()){
    $thing = [
        "name" => $test['name'],
        "start_time" => $test["start_time"],
        "end_time" => $test["end_time"]
    ];

    array_push($all, $thing);

}

send(200, $all); // check if handling json encoding
?>