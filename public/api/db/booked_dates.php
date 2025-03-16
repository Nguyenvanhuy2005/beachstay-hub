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

// Lấy tham số từ URL
$room_type_id = $_GET['room_type_id'] ?? null;

if (!$room_type_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing room_type_id parameter']);
    exit;
}

try {
    // Lấy các booking đã xác nhận hoặc đang chờ xác nhận cho loại phòng
    $query = "SELECT check_in, check_out FROM bookings 
              WHERE room_type_id = :room_type_id 
              AND status IN ('confirmed', 'pending')";
    
    $stmt = $db->prepare($query);
    $stmt->execute([':room_type_id' => $room_type_id]);
    
    $bookings = $stmt->fetchAll();
    
    // Mảng để lưu tất cả các ngày đã đặt
    $bookedDates = [];
    
    // Với mỗi booking, tính toán các ngày từ check_in đến check_out
    foreach ($bookings as $booking) {
        $checkIn = new DateTime($booking['check_in']);
        $checkOut = new DateTime($booking['check_out']);
        $interval = new DateInterval('P1D');
        $dateRange = new DatePeriod($checkIn, $interval, $checkOut);
        
        // Thêm mỗi ngày vào mảng bookedDates
        foreach ($dateRange as $date) {
            $bookedDates[] = $date->format('Y-m-d');
        }
        // Thêm cả ngày check-out
        $bookedDates[] = $checkOut->format('Y-m-d');
    }
    
    // Loại bỏ các ngày trùng lặp
    $bookedDates = array_unique($bookedDates);
    
    // Trả về kết quả dưới dạng mảng
    echo json_encode($bookedDates);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error fetching booked dates: ' . $e->getMessage()]);
}
