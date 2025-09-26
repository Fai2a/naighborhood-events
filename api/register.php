<?php
// Enable CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');
$role = strtolower(trim($data['role'] ?? 'resident')); // default role resident

// Basic validation
if (!$name || !$email || !$password || !in_array($role, ['resident','admin'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields (name, email, password, role) are required."]);
    exit;
}

// Database connection
$host = "localhost";
$db = "naighborhood-events"; // Your DB name
$user = "root";              // DB username
$pass = "";                  // DB password (empty for XAMPP)

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed", "error" => $conn->connect_error]);
    exit;
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare failed", "error" => $conn->error]);
    exit;
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert user into database
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare failed", "error" => $conn->error]);
    exit;
}
$stmt->bind_param("ssss", $name, $email, $hashedPassword, $role);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "User registered successfully!",
        "user" => [
            "name" => $name,
            "email" => $email,
            "role" => $role
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Registration failed.", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
