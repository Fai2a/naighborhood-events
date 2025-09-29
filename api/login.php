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

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

// Basic validation
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

// Database connection (via db.php)
require_once __DIR__ . "/../Backend/database.php";

// Database connection
// $host = "localhost";
// $db = "naighborhood-events";  // Your DB name
// $user = "root";               // DB username
// $pass = "";                   // DB password (empty for XAMPP)

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed", "error" => $conn->connect_error]);
    exit;
}

// Prepare statement to fetch user by email
$stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare failed", "error" => $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    $stmt->close();
    $conn->close();
    exit;
}

$userData = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $userData['password'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    $stmt->close();
    $conn->close();
    exit;
}

// Success response
http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Login successful!",
    "user" => [
        "id" => $userData['id'],
        "name" => $userData['name'],
        "email" => $userData['email'],
        "role" => $userData['role']
    ]
]);

$stmt->close();
$conn->close();
?>
