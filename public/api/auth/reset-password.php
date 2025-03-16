
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Đọc dữ liệu từ request
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email is required']);
        exit;
    }
    
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $redirect_to = isset($data['redirect_to']) ? $data['redirect_to'] : '';
    
    // Kiểm tra nếu là tài khoản mặc định hoặc có trong bảng admin_users
    if ($email === 'admin@annamvillage.vn') {
        // Gửi email đặt lại mật khẩu (giả lập)
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Password reset email sent'
        ]);
        exit;
    }
    
    // Kiểm tra trong bảng admin_users
    try {
        $stmt = $db->prepare("SELECT * FROM admin_users WHERE email = :email AND is_active = 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Gửi email đặt lại mật khẩu (giả lập)
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Password reset email sent'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found or not active']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Reset password error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
