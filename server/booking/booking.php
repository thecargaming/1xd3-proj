<?php

// Purpose to book

include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";



$email = filter_input(INPUT_POST, "email");
$phone = filter_input(INPUT_POST, "phone_number",FILTER_SANITIZE_SPECIAL_CHARS);
$company = filter_input(INPUT_POST, "company", FILTER_SANITIZE_SPECIAL_CHARS);
$date = filter_input(INPUT_POST, "date");

$db = connect_db();
$client_id = get_user_id($db);
 
$query = $db->prepare("INSERT INTO `meetings` (`representative`, `client`, `start_time`, `end_time`) VALUES (?,?,?,?)");
$query->execute([1, 1,'2025-04-01 13:30:00', '2025-04-01 14:15:00']);


send(200, ["msg"=>"success"]);



?>