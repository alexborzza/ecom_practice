<?php

require __DIR__ . '/../includes/cors.php';
header('Content-Type: application/json');

require __DIR__ . '/../includes/db.php';

try {
    $stmt = $pdo->query('SELECT * FROM categories');
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch categories']);
}
