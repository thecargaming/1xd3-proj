<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

$email = filter_input(INPUT_POST, "email") or send(400, ["msg" => "no email"]);
$password = filter_input(INPUT_POST, "password") or send(400, ["msg" => "no password"]);

$db = connect_db();
$query = $db->prepare("SELECT password_hash,id FROM users WHERE email = ?");
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
$hash = $row["password_hash"];

if (!password_verify($password, $hash)) {
    send(401, [
        "msg" => "invalid username or password"
    ]);
}

create_session($db, $row["id"]);

send(200, ["msg"=>"success"]);

?>

