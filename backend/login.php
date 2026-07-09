<?php

require __DIR__ . '/cors.php';
session_start();

header('Content-Type: application/json');

require __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);

$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and password are required']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
        exit;
    }

    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['name'];

    echo json_encode([
        'success' => true,
        'user'    => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Login failed']);
}
