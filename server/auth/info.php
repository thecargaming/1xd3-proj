<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

$name = filter_input(INPUT_GET, "name", FILTER_VALIDATE_BOOLEAN) or false;
$email = filter_input(INPUT_GET, "email", FILTER_VALIDATE_BOOLEAN) or false;
$phone = filter_input(INPUT_GET, "phone", FILTER_VALIDATE_BOOLEAN) or false;

if (!($name || $email || $phone)) send(400, ["msg"=>"no requested information"]);

$db = connect_db();
$info = get_user_info_unchecked($db, "first_name,last_name,email,phone");
if (is_null($info)) send(401, ["msg"=>"not logged in"]);

$data = [];
if ($name) {
    $data["first_name"] = $info["first_name"];
    $data["last_name"] = $info["last_name"];
}
if ($email) $data["email"] = $info["email"];
if ($phone && key_exists("phone", $info) && !is_null($info["phone"])) $data["phone"] = $info["phone"];

send(200, $data);
?>
