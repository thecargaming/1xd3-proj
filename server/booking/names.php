<?php

$db = connect_db();


$query = $db->prepare("
    SELECT CONCAT(users.first_name, ' ', users.last_name) name
    FROM representatives
    JOIN users ON representatives.id = users.user_id
");

$query->execute();

$array = [];

while($choice = $query->fetch()){
    $thing = [
        "name" => $test["name"]
    ];

    array_push($array, $thing);
}

send(200, $all);
?>