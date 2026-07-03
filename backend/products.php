<?php

header('Content-Type: application/json');
require __DIR__ . '/db.php';

try {
    $stmt = $pdo->query('SELECT * FROM products');
    $products = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data'    => $products,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to fetch products',
    ]);
}
?>