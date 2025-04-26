<?php

// Purpose to book

include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// i need to look for company too to match

$first_name = filter_input(INPUT_POST, "first_name");
$last_name = filter_input(INPUT_POST, "last_name");

// time issues as well

$start_time = filter_input(INPUT_POST, "start_time", FILTER_SANITIZE_SPECIAL_CHARS);
$end_time = filter_input(INPUT_POST, "end_time",FILTER_SANITIZE_SPECIAL_CHARS);

$date = filter_input(INPUT_POST, "date");


$db = connect_db();

// Slight problem with identifying users for putting into insert
$user_id = get_user_id($db);

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


// 1 added for testing purposes need to fix


$query = $db->prepare("INSERT INTO `meetings` (`representative`, `client`, `start_time`, `end_time`) VALUES (?,?,?,?)");
$query->execute([$representative_id, 1 ,$start, $end]);


send(200, ["msg"=>"success"]);
?>