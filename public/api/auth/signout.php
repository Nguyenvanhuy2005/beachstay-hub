
<?php
header('Content-Type: application/json');

// Xử lý CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Xử lý đăng xuất - trong triển khai thực tế có thể bạn cần phá hủy session phía server
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
