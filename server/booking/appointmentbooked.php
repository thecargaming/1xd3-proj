<?php


include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";


// email not necessary fix
$email = filter_input(INPUT_POST, "email");

$db = connect_db();
$client_id = get_user_id($db);

if(!$email){
    send(400, ["error" => "Invalid email!"]);
    exit;
}

$query = $db->prepare("SELECT `representative`,`client`, `start_time`, `end_time` FROM `meetings` WHERE `id` = ?");
$query->execute([$client_id]);

$all = [];

while($meeting = $query->fetch()){
    $details = [
        "representative" => $meeting['representative'],
        "start_time" => $meeting["start_time"],
        "end_time" => $meeting["end_time"]
    ];

    array_push($all, $details);

}

send(200, $all);

?>


