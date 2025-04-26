<?php

// Name:    Ahyan Khan
// Date:    2025-04-22
//
// Purpose:
// To actually book the meeting and send it to
// the sql database 
// Method: POST
// Parameters
//   string first_name
//   string last_name
//   string start_time
//   string end_time
//   string date


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$first_name = filter_input(INPUT_POST, "first_name");
$last_name = filter_input(INPUT_POST, "last_name");

$start_time = filter_input(INPUT_POST, "start_time", FILTER_SANITIZE_SPECIAL_CHARS);
$end_time = filter_input(INPUT_POST, "end_time",FILTER_SANITIZE_SPECIAL_CHARS);

$date = filter_input(INPUT_POST, "date");

if(!$first_name || !$last_name || !$start_time || !$end_time || !$date){
    send(400, ["error" => "An error occured in the booking process"]);
    exit;
}


$db = connect_db();
$user_id = get_user_id($db);


if(!$user_id){
    send(401,["msg"=>"not logged in"]);
}


$query = $db->prepare("    
    SELECT representatives.user_id 
    FROM representatives
    JOIN users ON representatives.user_id = users.id
    WHERE users.first_name = ? AND users.last_name = ?
");

$query->execute([$first_name,$last_name]);
$representative_id = $query->fetchColumn();

$start = $date . ' ' . $start_time; 
$end = $date . ' ' . $end_time; 



$query = $db->prepare("INSERT INTO `meetings` (`representative`, `client`, `start_time`, `end_time`) VALUES (?,?,?,?)");
$test = $query->execute([$representative_id, $user_id ,$start, $end]);

if($test){
    send(200, ["msg"=>"success"]);
} else {
    send(401, ["msg" => "Error occured can not book meeting"]);
}
?>