<?php

// Purpose:
//      Search the list of companies that the currently logged-in user represents, given a company name
// Method: GET


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


$company = filter_input(INPUT_GET, "company", FILTER_SANITIZE_SPECIAL_CHARS);


if (!$company) {
    send(400, ["msg" => "Missing company search term."]);
}

$db = connect_db();


$query = $db->prepare("
    SELECT companies.name 
    FROM representatives 
    JOIN companies ON representatives.companyID = companies.id 
    WHERE representatives.accountID = :accountID 
    AND LOWER(companies.name) LIKE :search;
");


if (!$query->execute([
    ":accountID" => $accountID,
    ":search" => "%" . strtolower($company) . "%"
])) {
    send(500, ["msg" => "Database query failed."]);
}


$data = $query->fetchAll();

send(200, $data);
?>
