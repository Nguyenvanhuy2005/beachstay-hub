
<?php
header('Content-Type: application/json');

// Cấu hình kết nối MySQL
$db_host = 'localhost';
$db_name = 'tên_database_của_bạn';
$db_user = 'người_dùng_database_của_bạn';
$db_pass = 'mật_khẩu_của_bạn';

// Xử lý CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

// Lấy tên hàm từ URL
$url_parts = explode('/', $_SERVER['REQUEST_URI']);
$function_name_index = array_search('rpc', $url_parts) + 1;

if (!isset($url_parts[$function_name_index])) {
    http_response_code(400);
    echo json_encode(['error' => 'Function name not specified']);
    exit;
}

$function_name = $url_parts[$function_name_index];

// Đọc dữ liệu từ request
$data = json_decode(file_get_contents('php://input'), true) ?? [];

// Xử lý gọi hàm
switch ($function_name) {
    case 'check_room_availability':
        checkRoomAvailability($db, $data);
        break;
    // Có thể thêm các hàm khác ở đây
    default:
        http_response_code(404);
        echo json_encode(['error' => "Function '$function_name' not found"]);
        break;
}

// Hàm kiểm tra phòng có sẵn không
function checkRoomAvailability($db, $data) {
    if (!isset($data['room_type_id']) || !isset($data['check_in']) || !isset($data['check_out'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required parameters']);
        return;
    }
    
    try {
        // Đếm tổng số phòng đã đặt trong khoảng thời gian yêu cầu
        $query = "SELECT COUNT(*) as booked_count FROM bookings 
                  WHERE room_type_id = :room_type_id 
                  AND status IN ('confirmed', 'pending')
                  AND (
                      (check_in <= :check_out AND check_out >= :check_in)
                  )";
        
        $stmt = $db->prepare($query);
        $stmt->execute([
            ':room_type_id' => $data['room_type_id'],
            ':check_in' => $data['check_in'],
            ':check_out' => $data['check_out']
        ]);
        
        $result = $stmt->fetch();
        $booked_rooms = $result['booked_count'] ?? 0;
        
        // Giả sử mỗi loại phòng có tổng số phòng là 5
        $total_rooms = 5;
        $remaining_rooms = max(0, $total_rooms - $booked_rooms);
        $available = ($remaining_rooms > 0);
        
        echo json_encode([
            'available' => $available,
            'remainingRooms' => $remaining_rooms
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error checking room availability: ' . $e->getMessage()]);
    }
}
