<?php
include "../lib/db.php";
include "../lib/send.php";

$email = filter_input(INPUT_POST, "email") or send(400, ["msg" => "no email"]);
$password = filter_input(INPUT_POST, "password") or send(400, ["msg" => "no password"]);

$db = connect_db();
$query = $db->prepare("SELECT password_hash FROM users WHERE email = ?");
if (!$query->execute([$email])) {
    send(401, [
        "msg" => "invalid username or password"
    ]);
}

$row = $query->fetch();
if ($row === false) {
    send(401, [
        "msg" => "invalid username or password"
    ]);
}
$hash = $row[0];

if (!password_verify($password, $hash)) {
    send(401, [
        "msg" => "invalid username or password"
    ]);
}

// TODO: session

send(200, ["msg"=>"success"]);

?>

