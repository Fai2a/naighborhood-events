<?php
// Enable CORS
header("Access-Control-Allow-Origin: *"); // frontend URL bhi specify kar sakte ho
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');
$role = strtolower(trim($data['role'] ?? 'resident'));

// Basic validation
if (!$name || !$email || !$password || !in_array($role, ['resident', 'admin'])) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input. All fields required."]);
    exit;
}

// Database connection
$host = "localhost";
$db = "your_database_name";
$user = "your_db_user";
$pass = "your_db_password";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(400);
    echo json_encode(["message" => "Email already registered."]);
    exit;
}
$stmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert user into database
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $hashedPassword, $role);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["message" => "User registered successfully!", "role" => $role]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Registration failed."]);
}

$stmt->close();
$conn->close();
?>
