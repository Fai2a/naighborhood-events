<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? '';
$status = $data['status'] ?? ''; // approved OR rejected

$conn = new mysqli("localhost", "root", "", "naighborhood-events");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB error"]);
    exit;
}

$approved = ($status === "approved") ? 1 : 0;

$sql = "UPDATE events SET approved=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $approved, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Event updated"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed"]);
}

$stmt->close();
$conn->close();
?>
