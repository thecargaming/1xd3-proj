<?php
// Name:    Patrick Chen
// Date:    2025-04-02
//
// Purpose:
//      Gets user information
// Method: GET
// Parameters
//      bool name [optional]
//      bool email [optional]
//      bool phone [optional]
//
// Returns
//      {
//          bool logged_in
//          string? first_name
//          string? last_name
//          string? email
//          string? phone
//      }

include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

$name = filter_input(INPUT_GET, "name", FILTER_VALIDATE_BOOLEAN) or false;
$email = filter_input(INPUT_GET, "email", FILTER_VALIDATE_BOOLEAN) or false;
$phone = filter_input(INPUT_GET, "phone", FILTER_VALIDATE_BOOLEAN) or false;


$db = connect_db();
$info = get_user_info_unchecked($db, "first_name,last_name,email,phone");
if (is_null($info)) send(200, ["logged_in"=>false]);
if (!($name || $email || $phone)) send(200, ["logged_in"=>true]);

$data = ["logged_in"=>true];
if ($name) {
    $data["first_name"] = $info["first_name"];
    $data["last_name"] = $info["last_name"];
}
if ($email) $data["email"] = $info["email"];
if ($phone && key_exists("phone", $info) && !is_null($info["phone"])) $data["phone"] = $info["phone"];

send(200, $data);
?>
