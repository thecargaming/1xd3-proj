<?php
// Name:    Patrick Chen
// Date:    2025-04-02
//
// Purpose:
//      Registering a new representative
// Method: POST
// Parameters
//      string company
//      string email [optional]
//      string phone [optional]

include "./lib/db.php";
include "./lib/send.php";
include "./lib/auth.php";

$company = filter_input(INPUT_POST, "company", FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL);
$phone = filter_input(INPUT_POST, "phone");

if (is_null($company)) send(400, ["msg"=>"no company"]);
if (!is_null($phone) && !preg_match('/^[0-9]{10}$/', $phone)) send(400, ["msg"=>"invalid phone number"]);

$db = connect_db();
$user_id = get_user_id($db);
if (is_null($user_id)) send(401, ["msg"=>"not logged in"]);

$query = $db->prepare("
INSERT INTO representatives (company, user_id, email, phone)
SELECT companies.id, ?, ?, ? FROM companies
WHERE companies.name = ?
");

if (!$query->execute([$user_id, $email, $phone, $company ])) send(500, ["msg"=>"unknown"]);

if ($query->rowCount() === 0) send(400, ["msg"=>"company not found"]);
send(201, ["msg"=>"success"]);

?>
