<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

$email = filter_input(INPUT_POST, "email") or send(400, ["msg" => "no email"]);
$password = filter_input(INPUT_POST, "password") or send(400, ["msg" => "no password"]);


$db = connect_db();
if (!is_null(get_user_id($db))) send(400, ["msg"=>"already logged in"]);

$query = $db->prepare("SELECT password_hash,id FROM users WHERE email = ?");
if (!$query->execute([$email])) {
    send(401, [
        "msg" => "invalid email or password"
    ]);
}

$row = $query->fetch();
if ($row === false) {
    send(401, [
        "msg" => "invalid email or password"
    ]);
}
$hash = $row["password_hash"];

if (!password_verify($password, $hash)) {
    send(401, [
        "msg" => "invalid email or password"
    ]);
}

create_session($db, $row["id"]);

send(200, ["msg"=>"success"]);

?>

