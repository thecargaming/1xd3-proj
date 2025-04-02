<?php
// Name:    Patrick Chen
// Date:    2025-04-01
//
// Purpose:
//      Logging into a user account
// Method: Any
// Parameters
//      None

include "../lib/db.php";
include "../lib/send.php";
include "../lib/auth.php";
$db = connect_db();
$res = destroy_session($db);
if ($res) send(200, ["msg"=>"success"]);
else send(200, ["msg"=>"not affected"]);
?>
