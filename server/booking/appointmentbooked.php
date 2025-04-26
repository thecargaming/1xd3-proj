<?php

// Name:    Ahyan Khan
// Date:    2025-04-26
// 
// Purpose:
// To retrieve all the meetings that the client booked


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";
include "/conflict_checker.php";


$db = connect_db();
$client_id = get_user_id($db);


if(!$client_id){
    send(401,["msg"=>"not logged in"]);
}


$query = $db->prepare("
SELECT meetings.start_time, meetings.end_time, CONCAT(users.first_name,' ', users.last_name) AS full_name
FROM meetings JOIN representatives ON meetings.representative = representatives.id 
JOIN users ON representatives.user_id = users.id WHERE meetings.id = ?;
");

$query->execute([$client_id]);

$all = [];

while($meeting = $query->fetch()){
    $start_time_split = explode(' ', $meeting['start_time']);
    $end_time_split = explode(' ', $meeting['end_time']);


    $details = [
        "full_name" => $meeting['full_name'],
        "date" => $start_time_split[0],
        "start_time" => $start_time_split[1],
        "end_time" => $end_time_split[1]
    ];

    array_push($all, $details);

}


send(200, $all);

?>

