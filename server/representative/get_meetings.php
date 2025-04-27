<?php
// Name:    Patrick Chen
// Date:    2025-04-26
//
// Purpose:
//      Gets the meetings a representatives is in
// Method: GET
// Parameters
//      int representative_id
//
// Returns on success
//      {
//          string name
//          string start (iso 8601)
//          string end (iso 8601)
//      }[]
//
// Returns on error
//      {
//          string msg
//      }

include "../lib/db.php";
include "../lib/auth.php";
include "../lib/send.php";

$rep_id = filter_input(INPUT_GET, "representative_id", FILTER_VALIDATE_INT);
if (is_null($rep_id)) send(400, ["msg"=>"representative id is required"]);

$db = connect_db();

$user_id = get_user_id($db);
$query = $db->prepare("
SELECT CONCAT(client.first_name, ' ', client.last_name) as name, meetings.start_time, meetings.end_time FROM meetings
INNER JOIN representatives
INNER JOIN users AS client ON meetings.client=client.id
INNER JOIN users AS rep_user ON representatives.user_id=rep_user.id
WHERE representatives.id = ?
AND rep_user.id = ?;
");
if (!$query->execute([$rep_id, $user_id])) send(500, ["msg"=>"unknown"]);

$data = [];
while ($row = $query->fetch()) {
    array_push($data, [
        "name" => $row["name"],
        "start" => $row["start_time"],
        "end" => $row["end_time"],
    ]);
}

send(200, $data);

?>
