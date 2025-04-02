<?php
function send(int $code, ?array $json = null) {
    if (!is_null($json)) echo json_encode($json);
    http_response_code($code);
    exit();
}
?>
