<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
    exit;
}

$name    = trim($input['customer_name'] ?? '');
$address = trim($input['customer_address'] ?? '');
$phone   = trim($input['customer_phone'] ?? '');
$items   = $input['items'] ?? [];

if ($name === '' || $address === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, address and phone are required']);
    exit;
}

if (!is_array($items) || count($items) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Cart is empty']);
    exit;
}

try {
    $pdo->beginTransaction();

    $total = 0;
    $validatedItems = [];

    // Re-fetch real prices from the DB rather than trusting the client,
    // so a tampered request can't place an order at a fake price.
    foreach ($items as $item) {
        if (!isset($item['product_id']) || !isset($item['quantity'])) {
            throw new Exception('Each item requires product_id and quantity');
        }

        $productId = (int) $item['product_id'];
        $quantity  = (int) $item['quantity'];

        if ($quantity <= 0) {
            throw new Exception('Quantity must be greater than zero');
        }

        $stmt = $pdo->prepare('SELECT price FROM products WHERE id = :id LIMIT 1');
        $stmt->bindParam(':id', $productId, PDO::PARAM_INT);
        $stmt->execute();
        $product = $stmt->fetch();

        if (!$product) {
            throw new Exception("Product {$productId} not found");
        }

        $price = (float) $product['price'];
        $total += $price * $quantity;

        $validatedItems[] = [
            'product_id' => $productId,
            'quantity'   => $quantity,
            'price'      => $price,
        ];
    }

    $orderStmt = $pdo->prepare(
        'INSERT INTO orders (user_id, customer_name, customer_address, customer_phone, total, status)
         VALUES (NULL, :name, :address, :phone, :total, :status)'
    );
    $orderStmt->execute([
        ':name'    => $name,
        ':address' => $address,
        ':phone'   => $phone,
        ':total'   => $total,
        ':status'  => 'pending',
    ]);

    $orderId = (int) $pdo->lastInsertId();

    $itemStmt = $pdo->prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (:order_id, :product_id, :quantity, :price)'
    );

    foreach ($validatedItems as $item) {
        $itemStmt->execute([
            ':order_id'   => $orderId,
            ':product_id' => $item['product_id'],
            ':quantity'   => $item['quantity'],
            ':price'      => $item['price'],
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success'  => true,
        'order_id' => $orderId,
        'total'    => $total,
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to place order: ' . $e->getMessage(),
    ]);
}
