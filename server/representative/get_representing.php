<?php
// Name:    Patrick Chen
// Date:    2025-04-23
//
// Purpose:
//      Finding all companies the logged in user is representing
// Method: GET
// Parameters
//      None
//
// Returns on success
//      {
//          int representative_id
//          string company_name
//      }[]
//
// Returns on error
//      {
//          string msg
//      }

include "../lib/db.php";
include "../lib/auth.php";
include "../lib/send.php";

$db = connect_db();
$userid = get_user_id($db);
if (is_null($userid)) send(401, ["msg"=>"not logged in"]);
$query = $db->prepare("
SELECT companies.name,representatives.id FROM representatives
INNER JOIN users ON representatives.user_id=users.id
INNER JOIN companies on representatives.company=companies.id
WHERE users.id = ?;
");
if (!$query->execute([$userid])) send(500, ["msg"=>"unknown"]);

$data = [];
while ($row = $query->fetch()) {
    array_push($data, [
        "representative_id" => $row["id"],
        "company_name" => $row["name"],
    ]);
}

send(200, $data);
