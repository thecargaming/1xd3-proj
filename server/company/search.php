<?php
// Name:    Patrick Chen
// Date:    2025-04-03
//
// Purpose:
//      Searching for a list of companies
// Method: GET
// Parameters
//      string company [optional]

include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";

$company = filter_input(INPUT_GET, "company", FILTER_SANITIZE_SPECIAL_CHARS);
$db = connect_db();
$query = $db->prepare("
SELECT name,address,phone FROM companies
WHERE LOWER(name) LIKE :search
OR LOWER(address) LIKE :search
OR phone LIKE :search;
");
if (!$query->execute([":search"=> "%" . strtolower($company) . "%"])) send(500, ["msg"=>"unknown"]);
$data = $query->fetchAll();
$companies = [];
foreach ($data as $d) {
    $companies[$d["name"]] = [
        "address" => $d["address"],
        "phone" => $d["phone"],
    ];
}
send(200, $companies)

?>
