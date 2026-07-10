<?php

// One-time/manual setup tool: visit this in your browser to add the
// "role" column to users (if it doesn't exist yet) and promote an
// account to admin, without writing any SQL yourself.
//
// This is a plain HTML page for YOU to click through, not an API used
// by the React app, so it has no CORS/JSON handling.

require __DIR__ . '/includes/db.php';

// 1. Make sure the "role" column exists
try {
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'role'");
    $columnExists = (bool) $stmt->fetch();

    if (!$columnExists) {
        $pdo->exec("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'");
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Failed to check/create the role column: ' . htmlspecialchars($e->getMessage());
    exit;
}

// 2. Handle a promote/demote action, if requested
$message = '';

if (isset($_GET['promote'])) {
    $id = (int) $_GET['promote'];
    $stmt = $pdo->prepare('UPDATE users SET role = "admin" WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $message = "User #{$id} promoted to admin.";
}

if (isset($_GET['demote'])) {
    $id = (int) $_GET['demote'];
    $stmt = $pdo->prepare('UPDATE users SET role = "user" WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $message = "User #{$id} set back to a regular user.";
}

// 3. List all users with their current role
$users = $pdo->query('SELECT id, name, email, role FROM users ORDER BY id')->fetchAll();

?>
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Admin role setup</title>
<style>
  body { font-family: sans-serif; background: #16171d; color: #ddd; padding: 2rem; }
  h1 { color: #fff; }
  table { border-collapse: collapse; width: 100%; max-width: 700px; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #444; }
  .role-admin { color: #dd5046; font-weight: bold; }
  .role-user { color: #999; }
  a.action { color: #dd5046; text-decoration: none; margin-right: 0.75rem; }
  a.action:hover { text-decoration: underline; }
  .message { background: #2e303a; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; }
</style>
</head>
<body>

<h1>User roles</h1>

<?php if ($message): ?>
  <div class="message"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>

<table>
  <thead>
    <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
  </thead>
  <tbody>
    <?php foreach ($users as $user): ?>
      <tr>
        <td><?= $user['id'] ?></td>
        <td><?= htmlspecialchars($user['name']) ?></td>
        <td><?= htmlspecialchars($user['email']) ?></td>
        <td class="role-<?= $user['role'] === 'admin' ? 'admin' : 'user' ?>">
          <?= htmlspecialchars($user['role']) ?>
        </td>
        <td>
          <?php if ($user['role'] === 'admin'): ?>
            <a class="action" href="?demote=<?= $user['id'] ?>">Remove admin</a>
          <?php else: ?>
            <a class="action" href="?promote=<?= $user['id'] ?>">Make admin</a>
          <?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
  </tbody>
</table>

</body>
</html>
