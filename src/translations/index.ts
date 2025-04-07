
// Type definitions
export type Language = 'vi' | 'en';

export type TranslationKey = 
  | 'hero_title' | 'hero_subtitle' | 'hero_booking_button' | 'hero_explore_button'
  | 'home' | 'about' | 'rooms' | 'services' | 'blog' | 'contact'
  | 'book_now' | 'learn_more' | 'view_all' | 'view_details'
  | 'about_title' | 'about_subtitle' | 'about_description'
  | 'room_types_title' | 'room_types_subtitle'
  | 'amenities_title' | 'amenities_subtitle'
  | 'testimonials_title' | 'testimonials_subtitle'
  | 'gallery_title' | 'gallery_subtitle'
  | 'cta_title' | 'cta_subtitle' | 'cta_description'
  | 'links' | 'subscribe' | 'subscribe_desc' | 'your_email' | 'subscribe_btn' | 'all_rights' | 'terms' | 'privacy' | 'cookies'
  | 'our_story' | 'our_mission' | 'our_vision' | 'our_values' | 'our_team'
  | 'filter_by' | 'price_range' | 'guests' | 'amenities' | 'view' | 'apply_filter' | 'reset_filter' | 'from_price' | 'per_night'
  | 'spa_wellness' | 'restaurant' | 'activities'
  | 'latest_posts' | 'categories' | 'popular_tags' | 'search_placeholder'
  | 'get_in_touch' | 'address' | 'phone' | 'email' | 'form_name' | 'form_email' | 'form_subject' | 'form_message' | 'form_submit'
  | 'booking_title' | 'check_in' | 'check_out' | 'adults' | 'children' | 'select_room' | 'guest_info' | 'payment_info'
  | 'name' | 'phone_number' | 'special_requests' | 'payment_method' | 'credit_card' | 'bank_transfer' | 'confirm_booking'
  | 'booking_summary' | 'total_nights' | 'room_price' | 'taxes_fees' | 'total_price'
  | 'admin_title' | 'dashboard' | 'bookings' | 'customers' | 'reports' | 'settings' | 'logout'
  | 'error_title' | 'error_description' | 'back_to_home'
  | 'book_now_action' | 'explore' | 'peaceful_space' | 'peaceful_space_desc' | 'luxury_experience' 
  | 'luxury_experience_desc' | 'premium_amenities' | 'premium_amenities_desc'
  | 'gallery' | 'discover_images' | 'gallery_desc' | 'view_more_images' | 'all'
  | 'about_An Nam' | 'villa_description' | 'error_loading_data' | 'error_loading_gallery' | 'try_again'
  | 'admin_login' | 'password' | 'login' | 'forgot_password' | 'back_to_login' | 'reset_password'
  | 'reset_password_sent' | 'admin_note' | 'login_error' | 'signing_in' | 'send_reset';

const viTranslations: Record<TranslationKey, string> = {
  // Home page
  hero_title: "An Nam Village Vũng Tàu",
  hero_subtitle: "Trải nghiệm không gian nghỉ dưỡng đẳng cấp bên bờ biển",
  hero_booking_button: "Đặt Phòng Ngay",
  hero_explore_button: "Khám Phá Dịch Vụ",
  
  // Navigation
  home: "Trang Chủ",
  about: "Về Chúng Tôi",
  rooms: "Loại Phòng",
  services: "Dịch Vụ",
  blog: "Blog",
  contact: "Liên Hệ",
  
  // Common buttons
  book_now: "Đặt Phòng",
  book_now_action: "Đặt Phòng Ngay",
  explore: "Khám Phá",
  learn_more: "Tìm Hiểu Thêm",
  view_all: "Xem Tất Cả",
  view_details: "Xem Chi Tiết",
  
  // Hero section
  peaceful_space: "Không Gian Yên Bình",
  peaceful_space_desc: "Tận hưởng kỳ nghỉ trong không gian yên bình tại An Nam Village",
  luxury_experience: "Trải Nghiệm Đẳng Cấp",
  luxury_experience_desc: "Dịch vụ 5 sao và tiện nghi cao cấp cho kỳ nghỉ hoàn hảo",
  premium_amenities: "Tiện Nghi Cao Cấp",
  premium_amenities_desc: "Hồ bơi, nhà hàng, spa và nhiều tiện ích đẳng cấp",
  
  // About section
  about_title: "Về An Nam Village",
  about_subtitle: "Không gian nghỉ dưỡng sang trọng bên bờ biển",
  about_description: "An Nam Village là một khu nghỉ dưỡng ven biển sang trọng tại Vũng Tàu, mang đến trải nghiệm độc đáo với kiến trúc đương đại pha trộn nét đẹp truyền thống Việt Nam. Tọa lạc tại vị trí đắc địa, mỗi phòng nghỉ đều có tầm nhìn tuyệt đẹp ra biển và được thiết kế tinh tế với các tiện nghi hiện đại, mang đến không gian sống tiện nghi và đẳng cấp.",
  about_An Nam: "Về An Nam Village",
  villa_description: "Mỗi villa được thiết kế với không gian mở, ánh sáng tự nhiên và các tiện nghi hiện đại, kết hợp với những điểm nhấn truyền thống Việt Nam để tạo nên trải nghiệm lưu trú đẳng cấp.",
  
  // Room types section
  room_types_title: "Loại Phòng",
  room_types_subtitle: "Không gian nghỉ dưỡng đa dạng",
  
  // Amenities section
  amenities_title: "Tiện Nghi & Dịch Vụ",
  amenities_subtitle: "Trải nghiệm sang trọng và tiện nghi",
  
  // Testimonials section
  testimonials_title: "Đánh Giá Từ Khách Hàng",
  testimonials_subtitle: "Khách hàng nói gì về chúng tôi",
  
  // Gallery section
  gallery_title: "Thư Viện Ảnh",
  gallery_subtitle: "Khám phá vẻ đẹp của An Nam Village",
  gallery: "Thư Viện Ảnh",
  discover_images: "Khám Phá Hình Ảnh",
  gallery_desc: "Ngắm nhìn không gian và thiết kế sang trọng của An Nam Village qua bộ sưu tập hình ảnh",
  view_more_images: "Xem Thêm Hình Ảnh",
  all: "Tất Cả",
  
  // CTA section
  cta_title: "Đặt Phòng Ngay Hôm Nay",
  cta_subtitle: "Và Nhận Ưu Đãi Đặc Biệt",
  cta_description: "Đặt phòng trực tiếp trên website chính thức của chúng tôi để nhận được giá tốt nhất cùng nhiều ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đặt phòng online.",
  
  // Footer
  links: "Liên Kết",
  subscribe: "Đăng Ký Nhận Tin",
  subscribe_desc: "Đăng ký để nhận thông tin ưu đãi mới nhất từ chúng tôi",
  your_email: "Email của bạn",
  subscribe_btn: "Đăng Ký",
  all_rights: "Tất cả các quyền được bảo lưu",
  terms: "Điều Khoản",
  privacy: "Chính Sách Bảo Mật",
  cookies: "Cookies",
  
  // About page
  our_story: "Câu Chuyện Của Chúng Tôi",
  our_mission: "Sứ Mệnh",
  our_vision: "Tầm Nhìn",
  our_values: "Giá Trị Cốt Lõi",
  our_team: "Đội Ngũ Của Chúng Tôi",
  
  // Room types page
  filter_by: "Lọc Theo",
  price_range: "Khoảng Giá",
  guests: "Số Khách",
  amenities: "Tiện Nghi",
  view: "Tầm Nhìn",
  apply_filter: "Áp Dụng",
  reset_filter: "Đặt Lại",
  from_price: "Từ",
  per_night: "/đêm",
  
  // Services page
  spa_wellness: "Spa & Sức Khỏe",
  restaurant: "Nhà Hàng",
  activities: "Hoạt Động",
  
  // Blog page
  latest_posts: "Bài Viết Mới Nhất",
  categories: "Danh Mục",
  popular_tags: "Thẻ Phổ Biến",
  search_placeholder: "Tìm kiếm bài viết...",
  
  // Contact page
  get_in_touch: "Liên Hệ Với Chúng Tôi",
  address: "Địa Chỉ",
  phone: "Điện Thoại",
  email: "Email",
  form_name: "Họ Tên",
  form_email: "Email",
  form_subject: "Tiêu Đề",
  form_message: "Nội Dung",
  form_submit: "Gửi",
  
  // Booking page
  booking_title: "Đặt Phòng",
  check_in: "Nhận Phòng",
  check_out: "Trả Phòng",
  adults: "Người Lớn",
  children: "Trẻ Em",
  select_room: "Chọn Phòng",
  guest_info: "Thông Tin Khách Hàng",
  payment_info: "Thông Tin Thanh Toán",
  name: "Họ Tên",
  phone_number: "Số Điện Thoại",
  special_requests: "Yêu Cầu Đặc Biệt",
  payment_method: "Phương Thức Thanh Toán",
  credit_card: "Thẻ Tín Dụng",
  bank_transfer: "Chuyển Khoản",
  confirm_booking: "Xác Nhận Đặt Phòng",
  booking_summary: "Thông Tin Đặt Phòng",
  total_nights: "Tổng Số Đêm",
  room_price: "Giá Phòng",
  taxes_fees: "Thuế & Phí",
  total_price: "Tổng Cộng",
  
  // Admin
  admin_title: "Quản Trị",
  dashboard: "Bảng Điều Khiển",
  bookings: "Đặt Phòng",
  customers: "Khách Hàng",
  reports: "Báo Cáo",
  settings: "Cài Đặt",
  logout: "Đăng Xuất",

  // Admin Login
  admin_login: "Đăng Nhập Quản Trị",
  password: "Mật Khẩu",
  login: "Đăng Nhập",
  forgot_password: "Quên Mật Khẩu?",
  back_to_login: "Quay Lại Đăng Nhập",
  reset_password: "Đặt Lại Mật Khẩu",
  reset_password_sent: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
  admin_note: "Tài khoản admin mặc định: admin@An Namvillage.vn",
  login_error: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
  signing_in: "Đang đăng nhập...",
  send_reset: "Gửi yêu cầu đặt lại mật khẩu",
  
  // Error page
  error_title: "Không Tìm Thấy Trang",
  error_description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.",
  back_to_home: "Về Trang Chủ",
  
  // Error messages
  error_loading_data: "Lỗi tải dữ liệu",
  error_loading_gallery: "Không thể tải thư viện ảnh. Vui lòng thử lại sau.",
  try_again: "Thử Lại"
};

const enTranslations: Record<TranslationKey, string> = {
  // Home page
  hero_title: "An Nam Village Vung Tau",
  hero_subtitle: "Experience luxury beachfront living",
  hero_booking_button: "Book Now",
  hero_explore_button: "Explore Services",
  
  // Navigation
  home: "Home",
  about: "About",
  rooms: "Rooms",
  services: "Services",
  blog: "Blog",
  contact: "Contact",
  
  // Common buttons
  book_now: "Book Now",
  book_now_action: "Book Now",
  explore: "Explore",
  learn_more: "Learn More",
  view_all: "View All",
  view_details: "View Details",
  
  // Hero section
  peaceful_space: "Peaceful Space",
  peaceful_space_desc: "Enjoy your vacation in a peaceful atmosphere at An Nam Village",
  luxury_experience: "Luxury Experience",
  luxury_experience_desc: "5-star service and premium amenities for a perfect getaway",
  premium_amenities: "Premium Amenities",
  premium_amenities_desc: "Swimming pool, restaurant, spa and many more luxurious facilities",
  
  // About section
  about_title: "About An Nam Village",
  about_subtitle: "Luxury beachfront resort",
  about_description: "An Nam Village is a luxurious beachfront resort in Vung Tau that offers a unique experience with contemporary architecture blended with traditional Vietnamese beauty. Located in a prime location, each accommodation has stunning sea views and is elegantly designed with modern amenities, providing a comfortable and sophisticated living space.",
  about_An Nam: "About An Nam Village",
  villa_description: "Each villa is designed with open spaces, natural light and modern amenities, combined with traditional Vietnamese accents to create a luxurious staying experience.",
  
  // Room types section
  room_types_title: "Room Types",
  room_types_subtitle: "Diverse accommodation options",
  
  // Amenities section
  amenities_title: "Amenities & Services",
  amenities_subtitle: "Luxury and convenience experience",
  
  // Testimonials section
  testimonials_title: "Guest Testimonials",
  testimonials_subtitle: "What our guests say about us",
  
  // Gallery section
  gallery_title: "Gallery",
  gallery_subtitle: "Explore the beauty of An Nam Village",
  gallery: "Gallery",
  discover_images: "Discover Images",
  gallery_desc: "Explore the luxurious spaces and elegant design of An Nam Village through our collection of images",
  view_more_images: "View More Images",
  all: "All",
  
  // CTA section
  cta_title: "Book Your Stay Today",
  cta_subtitle: "And Get Special Offers",
  cta_description: "Book directly on our official website to get the best price and many attractive offers exclusively for online booking customers.",
  
  // Footer
  links: "Links",
  subscribe: "Subscribe",
  subscribe_desc: "Subscribe to receive our latest offers",
  your_email: "Your email",
  subscribe_btn: "Subscribe",
  all_rights: "All rights reserved",
  terms: "Terms",
  privacy: "Privacy Policy",
  cookies: "Cookies",
  
  // About page
  our_story: "Our Story",
  our_mission: "Our Mission",
  our_vision: "Our Vision",
  our_values: "Our Values",
  our_team: "Our Team",
  
  // Room types page
  filter_by: "Filter By",
  price_range: "Price Range",
  guests: "Guests",
  amenities: "Amenities",
  view: "View",
  apply_filter: "Apply",
  reset_filter: "Reset",
  from_price: "From",
  per_night: "/night",
  
  // Services page
  spa_wellness: "Spa & Wellness",
  restaurant: "Restaurant",
  activities: "Activities",
  
  // Blog page
  latest_posts: "Latest Posts",
  categories: "Categories",
  popular_tags: "Popular Tags",
  search_placeholder: "Search posts...",
  
  // Contact page
  get_in_touch: "Get In Touch",
  address: "Address",
  phone: "Phone",
  email: "Email",
  form_name: "Name",
  form_email: "Email",
  form_subject: "Subject",
  form_message: "Message",
  form_submit: "Submit",
  
  // Booking page
  booking_title: "Booking",
  check_in: "Check In",
  check_out: "Check Out",
  adults: "Adults",
  children: "Children",
  select_room: "Select Room",
  guest_info: "Guest Information",
  payment_info: "Payment Information",
  name: "Full Name",
  phone_number: "Phone Number",
  special_requests: "Special Requests",
  payment_method: "Payment Method",
  credit_card: "Credit Card",
  bank_transfer: "Bank Transfer",
  confirm_booking: "Confirm Booking",
  booking_summary: "Booking Summary",
  total_nights: "Total Nights",
  room_price: "Room Price",
  taxes_fees: "Taxes & Fees",
  total_price: "Total Price",
  
  // Admin
  admin_title: "Admin",
  dashboard: "Dashboard",
  bookings: "Bookings",
  customers: "Customers",
  reports: "Reports",
  settings: "Settings",
  logout: "Logout",

  // Admin Login
  admin_login: "Admin Login",
  password: "Password",
  login: "Login",
  forgot_password: "Forgot Password?",
  back_to_login: "Back to Login",
  reset_password: "Reset Password",
  reset_password_sent: "Password reset email has been sent. Please check your inbox.",
  admin_note: "Default admin account: admin@An Namvillage.vn",
  login_error: "Invalid email or password. Please try again.",
  signing_in: "Signing in...",
  send_reset: "Send Reset Request",
  
  // Error page
  error_title: "Page Not Found",
  error_description: "The page you are looking for does not exist or has been moved.",
  back_to_home: "Back to Home",
  
  // Error messages
  error_loading_data: "Error Loading Data",
  error_loading_gallery: "Could not load gallery images. Please try again later.",
  try_again: "Try Again"
};

// Create a combined translations object
const translations = {
  vi: viTranslations,
  en: enTranslations
};

export { translations, viTranslations, enTranslations };
