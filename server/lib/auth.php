<?php
$SESSION_ID_NAME = "session_id";
$SESSION_EXPIRY_TIME = 3 * 24*60*60; // three days
function create_session(PDO $db, $user_id): bool {
    global $SESSION_ID_NAME, $SESSION_EXPIRY_TIME;
    $uuid = bin2hex(random_bytes(18));
    $query = $db->prepare("INSERT INTO sessions(session_id, user_id) VALUES(?, ?);");
    $success = $query->execute([$uuid, $user_id]);
    if ($success) {
        $query->closeCursor();
        setcookie($SESSION_ID_NAME, $uuid, time() + $SESSION_EXPIRY_TIME, '/');
    }
    return $success;
}

function destroy_session(PDO $db): bool {
    global $SESSION_ID_NAME;
    $session = filter_input(INPUT_COOKIE, $SESSION_ID_NAME);
    $query = $db->prepare("DELETE FROM sessions WHERE session_id=?;");
    $success = $query->execute([$session]);
    if ($success) {
        $query->closeCursor();
    }
    setcookie($SESSION_ID_NAME, '', -1, '/');
    return $success;
}

function destroy_all_sessions(PDO $db, $user_id) {
    global $SESSION_ID_NAME;
    $query = $db->prepare("DELETE FROM sessions WHERE user_id=?;");
    $success = $query->execute([$user_id]);
    if ($success) {
        $query->closeCursor();
        setcookie($SESSION_ID_NAME, '', -1, '/');
    }
    return $success;
}

?>
