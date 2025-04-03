<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_SPECIAL_CHARS);
$phone = filter_input(INPUT_POST, "phone_number");
$company = filter_input(INPUT_POST, "company", FILTER_SANITIZE_SPECIAL_CHARS);
$date = filter_input(INPUT_POST, "date", FILTER_VALIDATE_REGEXP);

$db = connect_db();

$query = $db->prepare("INSERT INTO `companies` VALUES (?,?,?,?)");
$query->execute([$email,$phone,$company,$date]);






?>