<?php
// Name:    Patrick Chen
// Date:    2025-04-23
//
// Purpose:
//      finding all available times
//      If no representative_id is present, it will find all available times
//      for the user. If representative_id is present, it will only find
//      available times for the representative.
// Method: GET
// Parameters
//      int representative_id [optional]
//
// Returns on success
//      {
//          int day_of_week
//          int id
//          string start_time (HH:MM:SS)
//          string end_time (HH:MM:SS)
//          string company_name
//      }
//
// Returns on error
//      {
//          string msg
//      }

include "../lib/auth.php";
include "../lib/db.php";
include "../lib/send.php";

$rep_id = filter_input(INPUT_GET, "representative_id");
if (!is_null($rep_id)) {
    $rep_id = filter_var($rep_id, FILTER_VALIDATE_INT);
    if (is_null($rep_id)) send(400, ["msg"=>"invalid representative id"]);
}

$db = connect_db();
$user_id = get_user_id($db);
if (is_null($rep_id)) {
    $query = $db->prepare("
SELECT companies.name,availability.start_time,availability.end_time,availability.day_of_week,availability.id FROM users
INNER JOIN representatives ON representatives.user_id=users.id
INNER JOIN availability ON availability.representative=representatives.id
INNER JOIN companies ON companies.id=representatives.company
WHERE users.id=?;
");
    if (!$query->execute([$user_id])) send(500, ["msg"=>"unknown"]);
    $data = [];
    while ($row = $query->fetch()) {
        array_push($data, [
            "day_of_week" => $row["day_of_week"],
            "start_time" => $row["start_time"],
            "end_time" => $row["end_time"],
            "company_name" => $row["name"],
            "id" => $row["id"],
        ]);
    }
    send(200, $data);
}


$query = $db->prepare("
SELECT companies.name,availability.start_time,availability.end_time,availability.day_of_week,availability.id FROM representatives
INNER JOIN availability ON availability.representative=representatives.id
INNER JOIN companies ON companies.id=representatives.company
WHERE representatives.id=?;
");
if (!$query->execute([$rep_id])) send(500, ["msg"=>"unknown"]);
$data = [];
while ($row = $query->fetch()) {
    array_push($data, [
        "day_of_week" => $row["day_of_week"],
        "start_time" => $row["start_time"],
        "end_time" => $row["end_time"],
        "company_name" => $row["name"],
        "id" => $row["id"],
    ]);
}
send(200, $data);
