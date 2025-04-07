// Type definitions
export type Language = 'vi' | 'en';

export type TranslationKey = 
  | 'hero_title' | 'hero_subtitle' | 'hero_booking_button' | 'hero_explore_button'
  | 'home' | 'about' | 'rooms' | 'services' | 'blog' | 'contact'
  | 'book_now' | 'learn_more' | 'view_all' | 'view_details'
  | 'about_title' | 'about_subtitle' | 'about_description'
  | 'room_types_title' | 'room_types_subtitle'
  | 'amenities_title' | 'amenities_subtitle' | 'amenities_intro'
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
  | 'about_annam' | 'villa_description' | 'error_loading_data' | 'error_loading_gallery' | 'try_again'
  | 'admin_login' | 'password' | 'login' | 'forgot_password' | 'back_to_login' | 'reset_password'
  | 'reset_password_sent' | 'admin_note' | 'login_error' | 'signing_in' | 'send_reset'
  | 'core_values' | 'dedication' | 'dedication_desc' | 'wisdom' | 'wisdom_desc' | 'nature' | 'nature_desc' | 'core_values_desc'
  | 'amenity_pool' | 'amenity_pool_desc' | 'amenity_kitchen' | 'amenity_kitchen_desc'
  | 'amenity_wifi' | 'amenity_wifi_desc' | 'amenity_food_guide' | 'amenity_food_guide_desc'
  | 'amenity_bicycle' | 'amenity_bicycle_desc' | 'amenity_open_space' | 'amenity_open_space_desc';

const viTranslations: Record<TranslationKey, string> = {
  // Home page
  hero_title: "AnNam Village Vũng Tàu",
  hero_subtitle: "Trải nghiệm không gian nghỉ dưỡng đẳng cấp bên bờ biển",
  hero_booking_button: "Đặt Phòng Ngay",
  hero_explore_button: "Khám Phá Dịch Vụ",
  
  // Navigation
  home: "Trang chủ",
  about: "Về chúng tôi",
  rooms: "Loại phòng",
  services: "Dịch vụ",
  blog: "Blog",
  contact: "Liên hệ",
  
  // Common buttons
  book_now: "Đặt Phòng",
  book_now_action: "Đặt Phòng Ngay",
  explore: "Khám Phá",
  learn_more: "Tìm Hiểu Thêm",
  view_all: "Xem Tất Cả",
  view_details: "Xem Chi Tiết",
  
  // Hero section
  peaceful_space: "Không gian Xanh Hóa",
  peaceful_space_desc: "Một nơi đủ gần để nghe sóng biển, đủ xa để an tĩnh lòng.",
  luxury_experience: "Trải nghiệm độc nhất Vũng Tàu",
  luxury_experience_desc: "Tiện nghi đầy đủ, phong cách hiện đại mà vẫn cho bạn được hít thở không khí an yên của gió biển và thiên nhiên.",
  premium_amenities: "Như được \"trở về nhà\"",
  premium_amenities_desc: "Ký ức đẹp của một chuyến đi... đôi khi chỉ bắt đầu từ cảm giác được ở yên đúng nghĩa.",
  
  // Core Values
  core_values: "Giá trị cốt lõi",
  core_values_desc: "Những điều nhỏ nhất — từ cách chào đón bạn, đến không gian sống, hay cách chúng tôi ứng xử với thiên nhiên — đều bắt đầu từ những giá trị này.",
  dedication: "Tận Tâm",
  dedication_desc: "Đặt trọn trái tim và tâm huyết vào từng chi tiết nhỏ, để mỗi trải nghiệm của du khách luôn là điều đáng nhớ và trọn vẹn nhất.",
  wisdom: "Thông Thái",
  wisdom_desc: "Để mỗi dịch vụ và lựa chọn phục vụ từ AnNam đều làm an lòng khách hàng. Chỉ mong mỗi khách đến – như khách về quê nhà.",
  nature: "Thuần Thiên",
  nature_desc: "Mỗi kiến trúc từ AnNam luôn hướng đến không gian sống thuần thiên nhiên - để du khách như được đắm mình giữa lòng thiên nhiên xanh mát.",
  
  // Amenities section
  amenities_title: "Dịch vụ & tiện ích",
  amenities_subtitle: "Luôn chăm chút từng trải nghiệm nhỏ nhặt, để mỗi khoảnh khắc tại AnNam đều trở nên dễ chịu và trọn vẹn nhất với du khách.",
  amenities_intro: "Luôn chăm chút từng trải nghiệm nhỏ nhặt, để mỗi khoảnh khắc tại AnNam đều trở nên dễ chịu và trọn vẹn nhất với du khách.",
  
  // New amenities translations
  amenity_pool: "Hồ bơi",
  amenity_pool_desc: "Thả mình thư giãn trong làn nước mát lành, phóng tầm mắt ra khung cảnh xanh mát - nơi hồ bơi ngoài trời chan hoà nắng gió từ biển xanh.",
  amenity_kitchen: "Góc bếp tiện nghi",
  amenity_kitchen_desc: "Một gian bếp đủ đầy để bạn tự tay nấu nướng, pha cà phê hay bày biện bữa cơm ấm áp cùng người thân — bởi đôi khi, cảm giác \"được về nhà\" lại đến từ những điều thật giản dị.",
  amenity_wifi: "Wifi",
  amenity_wifi_desc: "Luôn kết nối dễ dàng với wifi tốc độ cao phủ khắp khu vực nghỉ ngơi - dù làm việc hay giải trí cũng đều trọn vẹn.",
  amenity_food_guide: "Gợi ý ẩm thực địa phương",
  amenity_food_guide_desc: "AnNam luôn sẵn lòng gửi bạn các Travel Maps về những địa điểm ẩm thực & du ngoạn nội địa - từ hải sản tươi ngon đến những hàng quán lâu năm chỉ người bản xứ mới rành.",
  amenity_bicycle: "Cho thuê xe đạp",
  amenity_bicycle_desc: "Nhẹ nhàng đạp xe qua những con phố đầy nắng, nghe gió biển lùa qua vai áo — là cách chậm rãi nhất để cảm nhận Vũng Tàu.",
  amenity_open_space: "Không gian mở",
  amenity_open_space_desc: "Một khoảng xanh đủ yên để bạn ngồi lại với chính mình. Cũng đủ thoáng để cùng bạn bè hay gia đình tụ họp, kể cho nhau nghe vài câu chuyện vội quên giữa cuộc sống thường ngày.",
  
  // About section
  about_title: "Về AnNam Village",
  about_subtitle: "Không gian nghỉ dưỡng sang trọng bên bờ biển",
  about_description: "Villa AnNam - Nơi kiến trúc #XanhHóa từng trải nghiệm nghỉ dưỡng. Lấy cảm hứng từ kiến trúc Sinh Khí Hậu - nơi con người thật sự chan hòa cùng thiên nhiên, từng căn villa tại AnNam được thiết kế để bạn tìm thấy sự bình yên — vừa đủ riêng tư để an trú, vừa đủ cởi mở để tâm hồn được tắm mát cùng gió, nắng và biển trời Vũng Tàu.",
  about_annam: "Về AnNam Village",
  villa_description: "Ở AnNam, mỗi căn villa không chỉ là một chốn nghỉ chân — mà là một khoảng lặng rất riêng, đủ xanh để chở che, đủ gió để làm dịu tâm hồn, và đủ nắng để sưởi ấm những khoảnh khắc tưởng chừng bình thường nhất. Từ căn villa rộng rãi dành cho nhóm bạn đông người, đến không gian riêng tư cho những cặp đôi cần khoảng lặng - AnNam vẫn giữ nguyên một tinh thần: \"Xanh hóa từng trải nghiệm nghỉ dưỡng, để du khách ghé lại đều có thể thở thật sâu, sống thật chậm và lắng mình lại giữa miền gió mát.\"",
  
  // Room types section
  room_types_title: "Lựa chọn không gian lưu trú của riêng bạn",
  room_types_subtitle: "Từ những căn hộ nhỏ xinh giữa lòng thành phố, đến villa theo kiến trúc #XanhHóa để bạn tha hồ \"thả mình\" cùng hội bạn hay người thân - AnNam có đủ những lựa chọn gần gũi và thoải mái cho từng chuyến đi của bạn.",
  
  // Testimonials section
  testimonials_title: "Đánh Giá Từ Khách Hàng",
  testimonials_subtitle: "Khách hàng nói gì về chúng tôi",
  
  // Gallery section
  gallery_title: "Thư Viện Ảnh",
  gallery_subtitle: "Khám phá vẻ đẹp của AnNam Village",
  gallery: "Thư Viện Ảnh",
  discover_images: "Khám Phá Hình Ảnh",
  gallery_desc: "Ngắm nhìn không gian và thiết kế sang trọng của AnNam Village qua bộ sưu tập hình ảnh",
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
  admin_note: "Tài khoản admin mặc định: admin@annamvillage.vn",
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
  hero_title: "AnNam Village Vung Tau",
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
  peaceful_space: "Green Living Space",
  peaceful_space_desc: "A place close enough to hear the waves, far enough to calm your soul.",
  luxury_experience: "Unique Vung Tau Experience",
  luxury_experience_desc: "Full amenities, modern style while allowing you to breathe in the peaceful air of sea breeze and nature.",
  premium_amenities: "Feel Like \"Coming Home\"",
  premium_amenities_desc: "Beautiful memories of a journey... sometimes begin with the feeling of being truly at peace.",
  
  // Core Values
  core_values: "Core Values",
  core_values_desc: "The smallest things — from how we welcome you, to the living spaces, to how we interact with nature — all begin with these values.",
  dedication: "Dedication",
  dedication_desc: "Putting our heart and passion into every small detail, so that each guest experience is always memorable and complete.",
  wisdom: "Wisdom",
  wisdom_desc: "So that every service and option from AnNam reassures our customers. We simply hope each guest arrives - like coming home.",
  nature: "Natural Connection",
  nature_desc: "Every architectural element at AnNam always aims for living spaces in harmony with nature - so guests feel immersed in green nature.",
  
  // Amenities section
  amenities_title: "Services & Amenities",
  amenities_subtitle: "Always attentive to every small experience, making each moment at AnNam pleasant and complete for our guests.",
  amenities_intro: "Always attentive to every small experience, making each moment at AnNam pleasant and complete for our guests.",
  
  // New amenities translations
  amenity_pool: "Swimming Pool",
  amenity_pool_desc: "Relax in the cool water, looking out at the lush green surroundings - where the outdoor pool is bathed in sunshine and sea breezes.",
  amenity_kitchen: "Fully-Equipped Kitchen",
  amenity_kitchen_desc: "A complete kitchen where you can cook your own meals, brew coffee, or prepare a warm family dinner — because sometimes, the feeling of \"coming home\" comes from the simplest things.",
  amenity_wifi: "Wifi",
  amenity_wifi_desc: "Stay easily connected with high-speed wifi throughout the accommodation area - perfect for both work and entertainment.",
  amenity_food_guide: "Local Cuisine Recommendations",
  amenity_food_guide_desc: "AnNam is always happy to provide you with Travel Maps of local dining & sightseeing spots - from fresh seafood to long-established eateries only locals know about.",
  amenity_bicycle: "Bicycle Rental",
  amenity_bicycle_desc: "Gently cycling through sunny streets, feeling the sea breeze on your shoulders — the slowest way to experience Vung Tau.",
  amenity_open_space: "Open Space",
  amenity_open_space_desc: "A green space peaceful enough for self-reflection. Also spacious enough for friends and family to gather, sharing stories that are often forgotten in everyday life.",
  
  // About section
  about_title: "About AnNam Village",
  about_subtitle: "Luxury beachfront resort",
  about_description: "Villa AnNam - Where architecture #Greenifies every vacation experience. Inspired by Bioclimatic Architecture - where humans truly commune with nature, each villa at AnNam is designed for you to find peace — private enough for sanctuary, yet open enough for your soul to bathe in the wind, sun, and coastal horizon of Vung Tau.",
  about_annam: "About AnNam Village",
  villa_description: "At AnNam, each villa is not just a place to stay — but a very personal retreat, green enough to shelter, breezy enough to soothe the soul, and sunny enough to warm life's seemingly ordinary moments. From spacious villas for large groups of friends, to private spaces for couples seeking solitude - AnNam maintains one spirit: \"Greenifying every vacation experience, so visitors can breathe deeply, live slowly, and immerse themselves in the gentle breeze.\"",
  
  // Room types section
  room_types_title: "Choose your own living space",
  room_types_subtitle: "From charming apartments in the heart of the city to villas with #Greenified architecture where you can \"unwind\" with friends or family - AnNam has comfortable, welcoming options for all your journeys.",
  
  // Testimonials section
  testimonials_title: "Guest Testimonials",
  testimonials_subtitle: "What our guests say about us",
  
  // Gallery section
  gallery_title: "Gallery",
  gallery_subtitle: "Explore the beauty of AnNam Village",
  gallery: "Gallery",
  discover_images: "Discover Images",
  gallery_desc: "Explore the luxurious spaces and elegant design of AnNam Village through our collection of images",
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
  admin_note: "Default admin account: admin@annamvillage.vn",
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
