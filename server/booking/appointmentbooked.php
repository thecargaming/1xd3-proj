<?php


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$db = connect_db();
$client_id = get_user_id($db);
$query = $db->prepare("SELECT `user_id` FROM `sessions` WHERE `session_id` = ?");
$query->execute([$client_id]);

$thing = $query->fetch();
$actual_id = $thing['user_id'];


// need inner join to properly work
$query = $db->prepare("SELECT `representative`,`client`, `start_time`, `end_time` FROM `meetings` WHERE `id` = ?");
$query->execute([$actual_id]);

$all = [];

while($meeting = $query->fetch()){
    $details = [
        // fix
        "representative_name" => $meeting['representative_name'],
        "start_time" => $meeting["start_time"],
        "end_time" => $meeting["end_time"]
    ];

    array_push($all, $details);

}

send(200, $all);

?>


