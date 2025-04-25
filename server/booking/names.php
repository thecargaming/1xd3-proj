<?php
include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$db = connect_db();
$company = filter_input(INPUT_POST, "company");
$first_query = $db->prepare("SELECT id FROM `companies` WHERE `name` = ?");
$first_query->execute([$company]);

$company_id= $first_query->fetchColumn();

$query = $db->prepare("
    SELECT CONCAT(users.first_name, ' ', users.last_name) AS name
    FROM representatives 
    JOIN users ON representatives.user_id = users.id
    WHERE `company` = ?
");

$query->execute([$company_id]);

$array = [];


while($choice = $query->fetch()){
    $thing = [
        "name" => $choice["name"]
    ];

    array_push($array, $thing);
}

send(200, $array);
?>