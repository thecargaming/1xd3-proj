<?php
// Name:    Patrick Chen
// Date:    2025-04-23
//
// Purpose:
//      Sets the availability for a representative
// Method: POST
// Parameters
//      int representative_id
//      string start_time (HH:MM:SS)
//      string end_time (HH:MM:SS)
//      int day_of_week
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

$rep_id = filter_input(INPUT_GET, "representative_id", FILTER_VALIDATE_INT);
$start = filter_input(INPUT_GET, "start_time");
$end = filter_input(INPUT_GET, "end_time");
$day_of_week = filter_input(INPUT_GET, "day_of_week", FILTER_VALIDATE_INT);

if (is_null($day_of_week) || $day_of_week < 0 || $day_of_week >= 7) send(400, ["msg"=>"invalid day of week"]);
$validate_time_regex = '/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/';
if (!preg_match($validate_time_regex, $start)) send(400, ["msg"=>"invalid start time"]);
if (!preg_match($validate_time_regex, $end)) send(400, ["msg"=>"invalid start time"]);

$db = connect_db();
$user_id = get_user_id($db);
if (is_null($user_id)) send(400, ["msg"=>"not logged in"]);

$query = $db->prepare("
SELECT COUNT(*) FROM representative
INNER JOIN users ON users.id=representatives.user_id
WHERE representative.id=?
AND users.id=?;
");
if (!$query->execute([$rep_id, $user_id])) send(500, ["msg"=>"unknown"]);
$exists = (int) $query->fetch()[0];
$query->closeCursor();
if ($exists === 0) send(401, ["msg"=>"representative isn't owned by user"]);

$query = $db->prepare("
SELECT COUNT(*) FROM users
INNER JOIN representatives ON representatives.user_id=users.id
INNER JOIN availability ON representatives.id=availability.representative
WHERE users.id=?
AND CONVERT(CONVERT('?', TIME), INT) < CONVERT(availability.end_time, INT)
AND CONVERT(CONVERT('?', TIME), INT) > CONVERT(availability.start_time, INT)
AND availability.day_of_week=?;
");
if (!$query->execute([$user_id, $start, $end, $day_of_week])) send(500, ["msg"=>"unknown"]);
$conflict_count = (int) $query->fetch()[0];
$query->closeCursor();
if ($conflict_count != 0) send(400, ["msg"=>"conflicting availability times"]);

$query = $db->prepare("INSERT INTO availability(representative, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?);");
if (!$query->execute([$rep_id, $day_of_week, $start, $end])) send(500, ["msg"=>"unknown"]);

send(200);
