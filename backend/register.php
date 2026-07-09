<?php

require __DIR__ . '/cors.php';
session_start();

header('Content-Type: application/json');

require __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);

$name     = trim($input['name'] ?? '');
$email    = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($name === '' || $email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, email and password are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);

    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'Email is already registered']);
        exit;
    }

    // Password is never stored in plain text - password_hash() salts and hashes it.
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare(
        'INSERT INTO users (name, email, password) VALUES (:name, :email, :password)'
    );
    $stmt->execute([
        ':name'     => $name,
        ':email'    => $email,
        ':password' => $hashedPassword,
    ]);

    $userId = (int) $pdo->lastInsertId();

    // Auto-login right after registration
    $_SESSION['user_id']   = $userId;
    $_SESSION['user_name'] = $name;

    echo json_encode([
        'success' => true,
        'user'    => ['id' => $userId, 'name' => $name, 'email' => $email],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Registration failed']);
}
