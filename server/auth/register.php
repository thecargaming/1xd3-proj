<?php
// Name:    Patrick Chen
// Date:    2025-03-27
//
// Purpose:
//      Registering a new user
// Method: POST
// Parameters
//      string first_name
//      string last_name
//      string email
//      string password

include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

$first_name = filter_input(INPUT_POST, "first_name", FILTER_SANITIZE_SPECIAL_CHARS) or send(400, ["msg"=>"no first name"]);
$last_name = filter_input(INPUT_POST, "last_name", FILTER_SANITIZE_SPECIAL_CHARS) or send(400, ["msg"=>"no last name"]);
$password = filter_input(INPUT_POST, "password") or die("no password");
$email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL) or send(400, ["msg"=>"invalid email"]);

try {
    $db = connect_db();
    $userid = get_user_id($db);
    if (!is_null($userid)) send(400, ["msg"=>"already logged in"]);

    $hash = password_hash($password, PASSWORD_BCRYPT, [
        "cost" => 12
    ]);

    $q = $db->prepare("INSERT INTO users (email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)");
    if (!$q->execute([$email, $first_name, $last_name, $hash])) send(500, [ "msg" => "unknown" ]);
    $q->closeCursor();

    $q = $db->prepare("SELECT id FROM users WHERE email = ?");
    if (!$q->execute([$email])) send(500, [ "msg" => "unknown" ]);
    $row = $q->fetch();
    if (is_null($row)) send(500, [ "msg" => "unknown" ]);

    create_session($db, $row["id"]);

    send(201, [
        "msg" => "success"
    ]);

} catch(PDOException $e) {
    if ($e->getCode() === '23000') { // integrity constraint violation code
        send(409, [
            "msg" => "account already exists"
        ]);
    }
    send(500, [
        "msg" => "unknown "
    ]);
}
?>
