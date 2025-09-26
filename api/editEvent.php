<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? '';
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$date = $data['date'] ?? '';
$location = $data['location'] ?? '';
$createdBy = $data['createdBy'] ?? '';

if (!$id || !$title || !$description || !$date || !$location || !$createdBy) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "❌ All fields required"]);
    exit;
}

// Database connection
$host = "localhost";
$db_name = "naighborhood-events";
$username = "root";
$password_db = "";

$conn = new mysqli($host, $username, $password_db, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "❌ DB connection failed"]);
    exit;
}

// Update query
$sql = "UPDATE events 
        SET title=?, description=?, event_date=?, location=?, createdBy=? 
        WHERE id=?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "❌ Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("sssssi", $title, $description, $date, $location, $createdBy, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "✅ Event updated"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "❌ Failed to update: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
