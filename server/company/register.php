<?php
// Name:    Patrick Chen
// Date:    2025-04-02
//
// Purpose:
//      Registering a new company
// Method: POST
// Parameters
//      string company
//      string address
//      string phone

include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

$company = filter_input(INPUT_POST, "company", FILTER_SANITIZE_SPECIAL_CHARS) or send(400, ["msg"=>"no company"]);
$address = filter_input(INPUT_POST, "address", FILTER_SANITIZE_SPECIAL_CHARS) or send(400, ["msg"=>"no address"]);
$phone = filter_input(INPUT_POST, "phone") or send(400, ["msg"=>"no phone number"]);

if (!preg_match('/^[0-9]{10}$/', $phone)) send(400, ["msg"=>"invalid phone number"]);
if (strlen($company) <= 4) send(400, ["msg"=>"company name is too short"]);
if (strlen($address) == 0) send(400, ["msg"=>"address must be provided"]);

try {
    $db = connect_db();
    $query = $db->prepare("INSERT INTO companies (name, address, phone) VALUES (?, ?, ?)");
    if (!$query->execute([$company, $address, $phone])) send(500, ["msg"=>"unknown"]);
    send(201, ["msg"=>"success"]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') { // integrity constraint violation code
        send(409, [
            "msg" => "company already exists"
        ]);
    }
    send(500, [
        "msg" => "unknown"
    ]);
}


?>
