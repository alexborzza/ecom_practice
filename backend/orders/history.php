<?php

require __DIR__ . '/../includes/cors.php';
session_start();

header('Content-Type: application/json');

require __DIR__ . '/../includes/db.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'You must be logged in to view order history']);
    exit;
}

$userId = (int) $_SESSION['user_id'];

try {
    $ordersStmt = $pdo->prepare(
        'SELECT id, customer_name, customer_address, customer_phone, total, status, created_at
         FROM orders
         WHERE user_id = :user_id
         ORDER BY created_at DESC'
    );
    $ordersStmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $ordersStmt->execute();
    $orders = $ordersStmt->fetchAll();

    if (count($orders) === 0) {
        echo json_encode(['success' => true, 'data' => []]);
        exit;
    }

    $orderIds = array_column($orders, 'id');
    $placeholders = implode(',', array_fill(0, count($orderIds), '?'));

    $itemsStmt = $pdo->prepare(
        "SELECT oi.order_id, oi.product_id, oi.quantity, oi.price,
                p.name AS product_name, p.image_url
         FROM order_items oi
         LEFT JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id IN ({$placeholders})"
    );
    $itemsStmt->execute($orderIds);
    $allItems = $itemsStmt->fetchAll();

    $itemsByOrder = [];
    foreach ($allItems as $item) {
        $itemsByOrder[$item['order_id']][] = [
            'product_id'   => (int) $item['product_id'],
            'product_name' => $item['product_name'] ?? 'Product no longer available',
            'image_url'    => $item['image_url'],
            'quantity'     => (int) $item['quantity'],
            'price'        => (float) $item['price'],
        ];
    }

    $result = array_map(function ($order) use ($itemsByOrder) {
        $order['total'] = (float) $order['total'];
        $order['items'] = $itemsByOrder[$order['id']] ?? [];
        return $order;
    }, $orders);

    echo json_encode(['success' => true, 'data' => $result]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch order history']);
}
