<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? '';
$status = $data['status'] ?? '';

$conn = new mysqli("localhost", "root", "", "naighborhood-events");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// Map status
$approved = ($status === "approved") ? 1 : 0;

$sql = "UPDATE events SET approved=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $approved, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Event status updated", "approved" => $approved]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update"]);
}

$stmt->close();
$conn->close();
?>
