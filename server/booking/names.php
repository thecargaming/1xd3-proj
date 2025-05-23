<?php

// Name:    Ahyan Khan
// Date:    2025-04-22
//
// Purpose:
// Picking all the names inside of a company 
// and sending it through a ajax query to be shown 
// to the user
// Method: POST
// Parameters
//      string company


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$db = connect_db();
$company = filter_input(INPUT_POST, "company");
$first_query = $db->prepare("SELECT id FROM `companies` WHERE `name` = ?");
$first_query->execute([$company]);

$company_id= $first_query->fetchColumn();

$query = $db->prepare("
    SELECT representatives.id,users.first_name,users.last_name
    FROM representatives
    INNER JOIN users ON representatives.user_id = users.id
    WHERE `company` = ?
");

$query->execute([$company_id]);

$array = [];


while($choice = $query->fetch()){
    $thing = [
        "name" => "$choice[first_name] $choice[last_name]",
        "id" => $choice["id"],
    ];

    array_push($array, $thing);
}

send(200, $array);
?>
