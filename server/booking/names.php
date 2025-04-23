<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$db = connect_db();


$query = $db->prepare("
    SELECT CONCAT(users.first_name, ' ', users.last_name) AS name
    FROM representatives
    JOIN users ON representatives.user_id = users.id
");

$query->execute();

$array = [];

while($choice = $query->fetch()){
    $thing = [
        "name" => $choice["name"]
    ];

    array_push($array, $thing);
}

send(200, $array);
?>