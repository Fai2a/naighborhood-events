<?php
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "naighborhood-events";  // apna DB name check kar lo

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}
?>
