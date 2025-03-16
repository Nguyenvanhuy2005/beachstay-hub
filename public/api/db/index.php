<?php
header('Content-Type: application/json');

// Cấu hình kết nối MySQL
$db_host = 'localhost';
$db_name = 'annamvillage';
$db_user = 'Annamvillage';
$db_pass = 'Annamvillage@';

// Xử lý CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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

// Lấy bảng từ URL
$url_parts = explode('/', $_SERVER['REQUEST_URI']);
$table_index = array_search('db', $url_parts) + 1;

if (!isset($url_parts[$table_index])) {
    http_response_code(400);
    echo json_encode(['error' => 'Table name not specified']);
    exit;
}

$table = $url_parts[$table_index];

// Kiểm tra bảng hợp lệ
$allowed_tables = ['admin_users', 'amenities', 'blog_posts', 'bookings', 'gallery_images', 'room_date_prices', 'room_types'];
if (!in_array($table, $allowed_tables)) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid table']);
    exit;
}

// Xử lý các loại yêu cầu
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        handleGet($db, $table);
        break;
    case 'POST':
        handlePost($db, $table);
        break;
    case 'PUT':
        handlePut($db, $table);
        break;
    case 'DELETE':
        handleDelete($db, $table);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

// Xử lý GET request
function handleGet($db, $table) {
    // Kiểm tra endpoint đặc biệt cho xuất dữ liệu
    if (isset($_SERVER['PATH_INFO']) && $_SERVER['PATH_INFO'] === '/export') {
        $stmt = $db->prepare("SELECT * FROM `$table`");
        $stmt->execute();
        $results = $stmt->fetchAll();
        echo json_encode($results);
        exit;
    }

    // Lấy các tham số từ query string
    $columns = $_GET['columns'] ?? '*';
    $filter_column = $_GET['filter_column'] ?? null;
    $filter_value = $_GET['filter_value'] ?? null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    $order_column = $_GET['order_column'] ?? null;
    $order_direction = strtoupper($_GET['order_direction'] ?? 'ASC');
    
    // Xây dựng câu truy vấn SQL
    $query = "SELECT $columns FROM `$table`";
    $params = [];
    
    if ($filter_column && $filter_value !== null) {
        $query .= " WHERE `$filter_column` = ?";
        $params[] = $filter_value;
    }
    
    if ($order_column) {
        $query .= " ORDER BY `$order_column` " . ($order_direction === 'ASC' ? 'ASC' : 'DESC');
    }
    
    if ($limit) {
        $query .= " LIMIT ?";
        $params[] = $limit;
    }
    
    try {
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $results = $stmt->fetchAll();
        
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Query error: ' . $e->getMessage()]);
    }
}

// Xử lý POST request
function handlePost($db, $table) {
    // Kiểm tra endpoint đặc biệt
    if (isset($_SERVER['PATH_INFO'])) {
        if ($_SERVER['PATH_INFO'] === '/clear') {
            // Xóa tất cả dữ liệu từ bảng
            try {
                $stmt = $db->prepare("DELETE FROM `$table`");
                $stmt->execute();
                echo json_encode(['success' => true, 'message' => 'All records deleted']);
                exit;
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Error clearing table: ' . $e->getMessage()]);
                exit;
            }
        } else if ($_SERVER['PATH_INFO'] === '/bulk') {
            // Thêm nhiều bản ghi cùng lúc
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid data format']);
                exit;
            }
            
            $db->beginTransaction();
            
            try {
                foreach ($data as $record) {
                    $columns = array_keys($record);
                    $placeholders = implode(', ', array_fill(0, count($columns), '?'));
                    $column_names = '`' . implode('`, `', $columns) . '`';
                    
                    $query = "INSERT INTO `$table` ($column_names) VALUES ($placeholders)";
                    $stmt = $db->prepare($query);
                    $stmt->execute(array_values($record));
                }
                
                $db->commit();
                echo json_encode(['success' => true, 'count' => count($data)]);
            } catch (PDOException $e) {
                $db->rollBack();
                http_response_code(500);
                echo json_encode(['error' => 'Error inserting data: ' . $e->getMessage()]);
            }
            exit;
        }
    }
    
    // Xử lý thêm một bản ghi thông thường
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data format']);
        exit;
    }
    
    // Nếu không có ID, tạo UUID
    if (!isset($data['id'])) {
        $data['id'] = generateUUID();
    }
    
    $columns = array_keys($data);
    $placeholders = implode(', ', array_fill(0, count($columns), '?'));
    $column_names = '`' . implode('`, `', $columns) . '`';
    
    try {
        $query = "INSERT INTO `$table` ($column_names) VALUES ($placeholders)";
        $stmt = $db->prepare($query);
        $stmt->execute(array_values($data));
        
        $data['id'] = $data['id'] ?? $db->lastInsertId();
        echo json_encode($data);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error inserting data: ' . $e->getMessage()]);
    }
}

// Xử lý PUT request
function handlePut($db, $table) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data format']);
        exit;
    }
    
    // Lấy điều kiện từ query string
    $condition_column = null;
    $condition_value = null;
    
    foreach ($_GET as $key => $value) {
        $condition_column = $key;
        $condition_value = $value;
        break;
    }
    
    if (!$condition_column) {
        http_response_code(400);
        echo json_encode(['error' => 'Condition not specified']);
        exit;
    }
    
    $set_parts = [];
    $params = [];
    
    foreach ($data as $key => $value) {
        $set_parts[] = "`$key` = ?";
        $params[] = $value;
    }
    
    $set_clause = implode(', ', $set_parts);
    
    // Thêm điều kiện vào cuối mảng params
    $params[] = $condition_value;
    
    try {
        $query = "UPDATE `$table` SET $set_clause WHERE `$condition_column` = ?";
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'data' => $data]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'No records updated']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating data: ' . $e->getMessage()]);
    }
}

// Xử lý DELETE request
function handleDelete($db, $table) {
    // Lấy điều kiện từ query string
    $condition_column = null;
    $condition_value = null;
    
    foreach ($_GET as $key => $value) {
        $condition_column = $key;
        $condition_value = $value;
        break;
    }
    
    if (!$condition_column) {
        http_response_code(400);
        echo json_encode(['error' => 'Condition not specified']);
        exit;
    }
    
    try {
        $query = "DELETE FROM `$table` WHERE `$condition_column` = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$condition_value]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'No records deleted']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting data: ' . $e->getMessage()]);
    }
}

// Hàm tạo UUID
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
