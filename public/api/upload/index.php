
<?php
header('Content-Type: application/json');

// Xử lý CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Chỉ cho phép phương thức POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Kiểm tra xem có file được tải lên không
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        'error' => 'No file uploaded or upload error',
        'details' => isset($_FILES['file']) ? $_FILES['file']['error'] : 'No file data'
    ]);
    exit;
}

// Lấy thông tin về thư mục
$folder = $_POST['folder'] ?? 'misc';
$folder = preg_replace('/[^a-zA-Z0-9_-]/', '', $folder); // Làm sạch tên thư mục

// Tạo thư mục lưu trữ nếu chưa tồn tại
$upload_dir = __DIR__ . '/../../uploads/' . $folder;
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Lấy thông tin file
$file = $_FILES['file'];
$filename = $file['name'];
$tmp_name = $file['tmp_name'];
$filesize = $file['size'];

// Kiểm tra loại file (chỉ cho phép hình ảnh)
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($finfo, $tmp_name);
finfo_close($finfo);

if (!in_array($mime_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode(['error' => 'Only image files are allowed']);
    exit;
}

// Giới hạn kích thước file (5MB)
$max_size = 5 * 1024 * 1024;
if ($filesize > $max_size) {
    http_response_code(400);
    echo json_encode(['error' => 'File size exceeds limit (5MB)']);
    exit;
}

// Tạo tên file duy nhất
$extension = pathinfo($filename, PATHINFO_EXTENSION);
$unique_name = time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
$upload_path = $upload_dir . '/' . $unique_name;

// Di chuyển file từ thư mục tạm thời vào thư mục đích
if (move_uploaded_file($tmp_name, $upload_path)) {
    // Trả về URL công khai của file
    $public_url = '/uploads/' . $folder . '/' . $unique_name;
    echo json_encode(['url' => $public_url]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file']);
}
