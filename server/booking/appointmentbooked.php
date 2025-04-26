<?php

// Name:    Ahyan Khan
// Date:    2025-04-26
//
// Purpose:
// To retrieve all the meetings that the client booked


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$db = connect_db();
$client_id = get_user_id($db);

// if null redirect obviously to login




$query = $db->prepare("
SELECT meetings.start_time, meetings.end_time, CONCAT(users.first_name,' ', users.last_name) AS full_name
FROM meetings JOIN representatives ON meetings.representative = representatives.id 
JOIN users ON representatives.user_id = users.id WHERE meetings.id = ?;
");

$query->execute([$client_id]);

$all = [];

while($meeting = $query->fetch()){
    $details = [
        "full_name" => $meeting['full_name'],
        "start_time" => $meeting["start_time"],
        "end_time" => $meeting["end_time"]
    ];

    array_push($all, $details);

}

send(200, $all);

?>


