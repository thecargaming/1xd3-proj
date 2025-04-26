<?php
require_once "../lib/db.php";
require_once "../lib/send.php";
require_once "../lib/auth.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


function availability_booked($day_of_week, $date, $start_time, $end_time, $representative_id){
    var_dump($day_of_week);
    var_dump($start_time);
    var_dump($end_time);
    var_dump($representative_id);



    $db = connect_db();
    $query = $db->prepare("
        SELECT COUNT(*) > 0 FROM representatives
        INNER JOIN users ON users.id = representatives.user_id
        INNER JOIN availability ON availability.representative = representatives.id
        WHERE availability.day_of_week = ?
        AND ? > availability.start_time
        AND ? < availability.end_time
        AND (
            SELECT COUNT(*) FROM meetings
            INNER JOIN representatives AS rep ON meetings.representative = rep.id
            WHERE (meetings.client = users.id OR rep.user_id = users.id)
            AND ? < meetings.end_time
            AND ? > meetings.start_time
        ) = 0
        AND representatives.id = ?
    ");

    if (!$query->execute([$day_of_week, $start_time, $end_time, "$date $start_time", "$date $end_time", $representative_id])) {
        return null;
    }

    $result = $query->fetchColumn();

    if (!$result) {
        return null;
    }

    $query->closeCursor();
    return true; 
}
?>
