<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$date = filter_input(INPUT_POST, "date", FILTER_SANITIZE_SPECIAL_CHARS);
$db = connect_db();

$query = $db->prepare("SELECT `start_time`, `end_time` FROM `avaliability` WHERE `day_of_week` = ?");
$query->execute([$date]);

$all = $query->fetchAll();
echo json_encode($all);

?>