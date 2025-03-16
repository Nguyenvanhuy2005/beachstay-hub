
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

// Xử lý đăng nhập
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Đọc dữ liệu từ request
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit;
    }
    
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = $data['password'];
    
    // Kiểm tra nếu là tài khoản mặc định
    if ($email === 'admin@annamvillage.vn' && $password === 'admin123') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'user_id' => 'default-admin-user',
            'email' => $email
        ]);
        exit;
    }
    
    // Kiểm tra trong bảng admin_users
    try {
        $stmt = $db->prepare("SELECT * FROM admin_users WHERE email = :email AND is_active = 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Trong triển khai thực tế, bạn cần kiểm tra mật khẩu đã băm
            // Nhưng vì đây là demo, chúng ta sẽ xác thực bất kỳ người dùng nào có trong bảng
            
            // Tạo user_id từ email để đảm bảo tính nhất quán
            $user_id = md5($email);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'user_id' => $user_id,
                'email' => $email
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid login credentials']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Login error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
