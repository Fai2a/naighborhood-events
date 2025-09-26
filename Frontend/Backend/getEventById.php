<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Database connection
include __DIR__ . "/database.php"; // Ensure this path is correct

// Event ID check
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["error" => "Event ID is required"]);
    exit;
}

$event_id = intval($_GET['id']);

// Query with correct columns
$sql = "SELECT id, title, description, location, event_date, createdBy, approved 
        FROM events 
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "SQL prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $event = $result->fetch_assoc();

    // Convert approved column to status text for frontend convenience
    $event['status'] = intval($event['approved']) === 1 ? "approved" : "rejected";

    echo json_encode($event);
} else {
    echo json_encode(["error" => "Event not found"]);
}

$stmt->close();
$conn->close();
?>
