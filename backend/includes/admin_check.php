<?php

/**
 * Ensures the current session belongs to a logged-in admin user.
 * Call this AFTER session_start() and after $pdo is available.
 * Exits with a JSON error response and an appropriate status code if the check fails.
 */
function require_admin(PDO $pdo): void
{
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'You must be logged in']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT role FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user || $user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Admin access required']);
        exit;
    }
}
