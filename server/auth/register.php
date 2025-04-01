<?php
include "../lib/db.php";
include "../lib/send.php";

$first_name = filter_input(INPUT_POST, "first_name", FILTER_SANITIZE_SPECIAL_CHARS) or send(400, ["msg"=>"no first name"]);
$last_name = filter_input(INPUT_POST, "last_name", FILTER_SANITIZE_SPECIAL_CHARS) or send(400, ["msg"=>"no last name"]);
$password = filter_input(INPUT_POST, "password") or die("no password");
$email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL) or send(400, ["msg"=>"invalid email"]);

$hash = password_hash($password, PASSWORD_BCRYPT, [
    "cost" => 12
]);

try {
    $db = connect_db();

    $q = $db->prepare("INSERT INTO users (email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)");
    $res = $q->execute([$email, $first_name, $last_name, $hash]);

    if (!$res) {
        send(500, [
            "msg" => "unknown"
        ]);
    }
    send(200, [
        "msg" => "success"
    ]);

} catch(PDOException $e) {
    if ($e->getCode() === '23000') { // integrity constraint violation code
        send(401, [
            "msg" => "account already exists"
        ]);
    }
    send(500, [
        "msg" => "unknown"
    ]);
}
?>
