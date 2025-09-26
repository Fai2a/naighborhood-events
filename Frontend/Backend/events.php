<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow all origins for dev

include "database.php";

// include(__DIR__ . "/database.php");

$sql = "SELECT * FROM events ORDER BY id DESC";
$result = $conn->query($sql);

$events = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $events[] = [
            "id" => $row["id"],
            "title" => $row["title"],
            "location" => $row["location"],
            "description" => $row["description"]
        ];
    }
}

echo json_encode($events);
$conn->close();
?>
