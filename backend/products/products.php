<?php

require __DIR__ . '/../includes/cors.php';
session_start();

header('Content-Type: application/json');

require __DIR__ . '/../includes/db.php';
require __DIR__ . '/../includes/admin_check.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query('SELECT * FROM products');
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to fetch products']);
    }
    exit;
}

if ($method === 'POST') {
    require_admin($pdo);

    $input = json_decode(file_get_contents('php://input'), true);

    $name        = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');
    $price       = $input['price'] ?? null;
    $imageUrl    = trim($input['image_url'] ?? '');
    $stock       = $input['stock'] ?? 0;
    $categoryId  = $input['category_id'] ?? null;

    if ($name === '' || $price === null || !is_numeric($price)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name and a valid price are required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare(
            'INSERT INTO products (name, description, price, image_url, stock, category_id)
             VALUES (:name, :description, :price, :image_url, :stock, :category_id)'
        );
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':price', $price);
        $stmt->bindValue(':image_url', $imageUrl);
        $stmt->bindValue(':stock', (int) $stock, PDO::PARAM_INT);
        $stmt->bindValue(
            ':category_id',
            $categoryId,
            $categoryId === null || $categoryId === '' ? PDO::PARAM_NULL : PDO::PARAM_INT
        );
        $stmt->execute();

        echo json_encode(['success' => true, 'id' => (int) $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create product']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
