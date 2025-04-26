<?php

// Name:    Ahyan Khan
// Date:    2025-04-22
//
// Purpose:
// To actually book the meeting and send it to
// the sql database 
// Method: POST
// Parameters
//   int representative (id)
//   string start_time
//   string end_time
//   string date


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$rep_id = filter_input(INPUT_POST, "representative", FILTER_VALIDATE_INT);
$start_time = filter_input(INPUT_POST, "start_time", FILTER_SANITIZE_SPECIAL_CHARS);
$end_time = filter_input(INPUT_POST, "end_time",FILTER_SANITIZE_SPECIAL_CHARS);

$date = filter_input(INPUT_POST, "date");

if(!$rep_id || !$start_time || !$end_time || !$date){
    send(400, ["error" => "An error occured in the booking process"]);
    exit;
}


$db = connect_db();
$user_id = get_user_id($db);


if(!$user_id){
    send(401,["msg"=>"not logged in"]);
}

$new_date = new DateTime($date);
$dayOfWeek = $new_date->format('w');

$query = $db->prepare("
SELECT COUNT(*) > 0 FROM representatives
INNER JOIN users on users.id=representatives.user_id
INNER JOIN availability ON availability.representative=representatives.id
WHERE availability.day_of_week = ?
AND CONVERT(CONVERT(?, TIME), INT) >= CONVERT(availability.start_time, INT)
AND CONVERT(CONVERT(?, TIME), INT) <= CONVERT(availability.end_time, INT)
AND (
    SELECT COUNT(*) FROM meetings
    INNER JOIN representatives AS rep ON meetings.representative=rep.id
    WHERE (meetings.client=users.id OR rep.user_id=users.id)
    AND CONVERT(CONVERT(?, DATETIME), INT) < CONVERT(meetings.end_time, INT)
    AND CONVERT(CONVERT(?, DATETIME), INT) > CONVERT(meetings.start_time, INT)
    ) = 0
AND representatives.id = ?;
");
if (!$query->execute([$dayOfWeek, $start_time, $end_time, "$date $start_time", "$date $end_time", $rep_id]))
    send(500, ["msg" => "unknown"]);
if (!(bool)($query->fetch()[0])) send(400, ["msg" => "no available time"]);
$query->closeCursor();



$query = $db->prepare("INSERT INTO `meetings` (`representative`, `client`, `start_time`, `end_time`) VALUES (?,?,?,?)");
$test = $query->execute([$rep_id, $user_id ,"$date $start_time", "$date $end_time"]);

if($test){
    send(200, ["msg"=>"success"]);
} else {
    send(401, ["msg" => "Error occured can not book meeting"]);
}
?>
