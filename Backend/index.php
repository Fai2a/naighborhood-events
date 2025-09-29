
<?php
// index.php

// Set headers (CORS + JSON)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

// Database connection (from env vars on Render)
$host = getenv("DB_HOST");
$user = getenv("DB_USER");
$pass = getenv("DB_PASS");
$db   = getenv("DB_NAME");

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

// Get requested URI (example: /api/register)
$request = $_SERVER['REQUEST_URI'];

// Simple routing
switch (true) {
    case preg_match("/\/api\/register/i", $request):
        require __DIR__ . "/api/register.php";
        break;

    case preg_match("/\/api\/login/i", $request):
        require __DIR__ . "/api/login.php";
        break;

    case preg_match("/\/api\/addEvent/i", $request):
        require __DIR__ . "/api/add-events.php";
        break;

    case preg_match("/\/api\/getEvents/i", $request):
        require __DIR__ . "/api/getEvents.php";
        break;

    default:
        echo json_encode([
            "status" => "ok",
            "message" => "Neighborhood Events API is running 🚀"
        ]);
        break;
}
