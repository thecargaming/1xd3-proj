<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$db = connect_db();


$query = $db->prepare("
    SELECT name FROM companies
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