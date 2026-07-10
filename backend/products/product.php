<?php

require __DIR__ . '/../includes/cors.php';
session_start();

header('Content-Type: application/json');

require __DIR__ . '/../includes/db.php';
require __DIR__ . '/../includes/admin_check.php';

if (!isset($_GET['id']) || !ctype_digit((string) $_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A valid numeric "id" parameter is required']);
    exit;
}

$id = (int) $_GET['id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $product = $stmt->fetch();

        if (!$product) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Product not found']);
            exit;
        }

        echo json_encode(['success' => true, 'data' => $product]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to fetch product']);
    }
    exit;
}

if ($method === 'PUT') {
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
            'UPDATE products
             SET name = :name, description = :description, price = :price,
                 image_url = :image_url, stock = :stock, category_id = :category_id
             WHERE id = :id'
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
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update product']);
    }
    exit;
}

if ($method === 'DELETE') {
    require_admin($pdo);

    try {
        $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        // Likely a foreign key constraint from order_items referencing this product
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error'   => 'Failed to delete product (it may be referenced by existing orders)',
        ]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
