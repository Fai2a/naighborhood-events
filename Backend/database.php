<?php
// Database connection using environment variables

$host = getenv("DB_HOST") ?: "localhost";   // fallback = localhost
$user = getenv("DB_USER") ?: "root";        // fallback = root
$pass = getenv("DB_PASS") ?: "";            // fallback = empty password
$db   = getenv("DB_NAME") ?: "naighborhood-events";  // fallback = your DB name

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "error" => "Database connection failed",
        "details" => $conn->connect_error
    ]));
}

// Optional: set charset
$conn->set_charset("utf8");

?>
