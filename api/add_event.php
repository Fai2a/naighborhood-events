<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$title = trim($data['title'] ?? '');
$description = trim($data['description'] ?? '');
$event_date = trim($data['event_date'] ?? $data['date'] ?? ''); // accept both keys
$location = trim($data['location'] ?? '');
$createdBy = trim($data['createdBy'] ?? '');

// Validation
if (!$title || !$description || !$event_date || !$location || !$createdBy) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "❌ All fields are required",
        "received" => $data
    ]);
    exit;
}

// DB connection
$host = "localhost";
$db_name = "naighborhood-events";
$username = "root";
$password_db = "";

$conn = new mysqli($host, $username, $password_db, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "❌ Database connection failed",
        "error" => $conn->connect_error
    ]);
    exit;
}

// Insert query
$sql = "INSERT INTO events (title, description, event_date, location, createdBy, approved) 
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "❌ Prepare failed",
        "error" => $conn->error
    ]);
    exit;
}

$approved = 0;
$stmt->bind_param("sssssi", $title, $description, $event_date, $location, $createdBy, $approved);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "✅ Event added successfully!"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "❌ Failed to add event",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
