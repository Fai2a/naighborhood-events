<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Database connection
$host = "localhost";
$db_name = "naighborhood-events";  // your DB name
$username = "root";
$password_db = "";

$conn = new mysqli($host, $username, $password_db, $db_name);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "❌ Database connection failed."]);
    exit;
}

// Fetch events (latest first)
$sql = "SELECT id, title, description, event_date, location, createdBy, approved 
        FROM events 
        ORDER BY event_date DESC";   // ✅ fixed column name
$result = $conn->query($sql);

$events = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Convert approved column into true/false
        $row['approved'] = (bool)$row['approved'];
        $events[] = $row;
    }
}

// ✅ Always return plain array
echo json_encode($events);

$conn->close();
?>
