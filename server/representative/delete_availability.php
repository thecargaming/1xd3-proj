<?php
// Name:    Patrick Chen
// Date:    2025-04-23
//
// Purpose:
//      Deletes a availability slot for a representative
// Method: POST
// Parameters
//      int availability_id
//
// Returns on success
//      None
//
// Returns on error
//      {
//          string msg
//      }

include "../lib/auth.php";
include "../lib/db.php";
include "../lib/send.php";

$availability_id = filter_input(INPUT_POST, "availability_id", FILTER_VALIDATE_INT);

if (is_null($availability_id)) send(400, ["msg"=>"availability_id required but not present"]);

$db = connect_db();
$user_id = get_user_id($db);
if (is_null($user_id)) send(400, ["msg"=>"not logged in"]);

$query = $db->prepare("
SELECT COUNT(*) FROM availability
INNER JOIN representatives ON availability.representative=representatives.id
INNER JOIN users ON representatives.user_id=users.id
WHERE users.id = ?
AND availability.id = ?;
");
if (!$query->execute([$user_id, $availability_id])) send(500, ["msg"=>"unknown"]);
$exists = (int) $query->fetch()[0];
$query->closeCursor();
if ($exists === 0) send(401, ["msg"=>"availability is not owned by user"]);

$query = $db->prepare("DELETE FROM availability WHERE availability.id=?;");
if (!$query->execute([$availability_id])) send(500, ["msg"=>"unknown"]);
$query->closeCursor();
send(200);
