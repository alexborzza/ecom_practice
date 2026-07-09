<?php

require __DIR__ . '/cors.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => true, 'user' => null]);
    exit;
}

require __DIR__ . '/db.php';

try {
    $stmt = $pdo->prepare('SELECT id, name, email FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $_SESSION['user_id']]);
    $user = $stmt->fetch();

    echo json_encode(['success' => true, 'user' => $user ?: null]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch session user']);
}
