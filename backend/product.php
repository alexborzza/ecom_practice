<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require __DIR__ . '/db.php';

// Validate input
if (!isset($_GET['id']) || !ctype_digit((string) $_GET['id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'A valid numeric "id" parameter is required',
    ]);
    exit;
}

$id = (int) $_GET['id'];

try {
    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $product = $stmt->fetch();

    if (!$product) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error'   => 'Product not found',
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'data'    => $product,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to fetch product',
    ]);
}