<?php
include "../db.php";

$first_name = filter_input(INPUT_POST, "first_name", FILTER_SANITIZE_SPECIAL_CHARS) or die("no first name");
$last_name = filter_input(INPUT_POST, "last_name", FILTER_SANITIZE_SPECIAL_CHARS) or die("no last name");
$password = filter_input(INPUT_POST, "password", FILTER_DEFAULT) or die("no password");
$email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL) or die("invalid email");

$hash = password_hash($password, PASSWORD_BCRYPT, [
    "cost" => 12
]);

$db = connect_db();
$q = $db->prepare("INSERT INTO users (email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)");
$res = $q->execute([$email, $first_name, $last_name, $hash]);

if ($res) {
    echo "success";
} else {
    echo "fail";
}

?>
