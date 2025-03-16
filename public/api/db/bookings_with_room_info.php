<?php
header('Content-Type: application/json');

// Cấu hình kết nối MySQL
$db_host = 'localhost';
$db_name = 'annamvillage';
$db_user = 'Annamvillage';
$db_pass = 'Annamvillage@';

// Xử lý CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Kết nối đến database
try {
    $db = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Lấy tham số status từ URL (nếu có)
$status = isset($_GET['status']) ? $_GET['status'] : null;

try {
    // Xây dựng câu truy vấn để join dữ liệu từ bookings và room_types
    $query = "SELECT 
                b.*, 
                r.name as room_name, 
                r.name_en as room_name_en,
                r.image_url,
                r.price,
                r.weekend_price
              FROM bookings b
              LEFT JOIN room_types r ON b.room_type_id = r.id";
    
    // Thêm điều kiện lọc theo status nếu có
    $params = [];
    if ($status) {
        $query .= " WHERE b.status = :status";
        $params[':status'] = $status;
    }
    
    // Sắp xếp theo ngày tạo mới nhất
    $query .= " ORDER BY b.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    
    $bookings = $stmt->fetchAll();
    
    // Trả về kết quả dưới dạng JSON
    echo json_encode($bookings);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error fetching bookings with room info: ' . $e->getMessage()]);
}
