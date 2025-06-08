<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['filename']) || !isset($data['content'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing filename or content"]);
    exit;
}

$filename = basename($data['filename']); // Empêche le path traversal
$filepath = __DIR__ . "/payloads/" . $filename;

if (file_put_contents($filepath, $data['content']) !== false) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save file"]);
}
