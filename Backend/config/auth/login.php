<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

// Basic validation
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["message" => "Email and password are required."]);
    exit;
}

// Database connection
$host = "localhost";
$db = "your_database_name";   // 👈 apna DB name likho
$user = "your_db_user";       // 👈 apna DB username likho
$pass = "your_db_password";   // 👈 apna DB password likho

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

// Fetch user by email
$stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid email or password."]);
    exit;
}

$userData = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $userData['password'])) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid email or password."]);
    exit;
}

// Success response
http_response_code(200);
echo json_encode([
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
