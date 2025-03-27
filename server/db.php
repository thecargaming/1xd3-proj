<?php
function connect_db() {
    $username = getenv("DATABASE_USERNAME");
    $password = getenv("DATABASE_PASSWORD");
    $dbname = getenv("DATABASE_NAME");

    $db = new PDO("mysql:host=127.0.0.1;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $db;
}
?>
