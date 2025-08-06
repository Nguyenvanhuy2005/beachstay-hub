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
  | 'core_values' | 'dedication' | 'dedication_desc' | 'wisdom' | 'wisdom_desc' | 'nature' | 'nature_desc'
  | 'amenity_pool' | 'amenity_pool_desc' | 'amenity_kitchen' | 'amenity_kitchen_desc'
  | 'amenity_wifi' | 'amenity_wifi_desc' | 'amenity_food_guide' | 'amenity_food_guide_desc'
  | 'amenity_open_space' | 'amenity_open_space_desc';

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
  dedication: "Tận Tâm",
  dedication_desc: "Đặt trọn trái tim và tâm huyết vào từng chi tiết nhỏ, để mỗi trải nghiệm của du khách luôn là điều đáng nhớ và trọn vẹn nhất.",
  wisdom: "Thông thái",
  wisdom_desc: "Để mỗi dịch vụ và lựa chọn phục vụ từ AnNam đều làm an lòng khách hàng. Chỉ mong mỗi khách đến – như khách về quê nhà.",
  nature: "Thuần Thiên",
  nature_desc: "Mỗi kiến trúc từ AnNam luôn hướng đến không gian sống thuần thiên nhiên - để du khách như được đắm mình giữa lòng thiên nhiên xanh mát.",
  
  // Amenities section
  amenities_title: "Để từng điều nhỏ đều trở thành điều đáng nhớ",
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
  amenity_open_space: "Không gian mở",
  amenity_open_space_desc: "Một khoảng xanh đủ yên để bạn ngồi lại với chính mình. Cũng đủ thoáng để cùng bạn bè hay gia đình tụ họp, kể cho nhau nghe vài câu chuyện vội quên giữa cuộc sống thường ngày.",
  
  // About section - NEW TEXT
  about_title: "Về AnNam Village",
  about_subtitle: "Một khoảng dừng bình yên giữa lòng Vũng Tàu",
  about_description: "AnNam không chỉ là nơi lưu trú – mà là nơi để mỗi người tìm thấy khoảng lặng riêng mình trong nắng, trong cây, trong gió.. Từ kiến trúc xanh mát đến bài trí gần gũi, từng căn villa tại AnNam ở đó để chở che tâm hồn, làm dịu lại những \"vết hằn\" từ chốn ồn ào thường ngày...",
  about_annam: "Về AnNam Village",
  villa_description: "Ở đây, có những niềm vui khác với thường nhật: một bữa ngon cùng đại gia đình, một buổi chiều bên hồ bơi cùng mấy đứa bạn thân, một khoảng sân rù rì tiếng lá reo trong gió, một khoảng tụ tập vang lên tiếng cười... AnNam không bán một đêm nghỉ, AnNam là nhiều chốn, để bạn tìm thấy những khoảnh khắc tưởng chừng bình thường - mà lâu rồi bạn chưa chạm đến...",
  
  // Room types section - UPDATED TEXT
  room_types_title: "Hãy chọn một nơi nghỉ… vừa đủ để bạn an yên",
  room_types_subtitle: "AnNam có \"trọn\" các lựa chọn cho bạn và những người thân yêu để chuyến đi thêm \"vẹn\" tròn hơn: Một căn phòng ngủ yên bình bên tiếng sóng biển.. Một căn villa chứa đựng cả hệ sinh thái rừng mini… Một không gian để con trẻ nô đùa bên sân cỏ… Hay một góc yên tĩnh để ngồi bộc bạch cùng nhau… Chọn căn nào không quan trọng bằng việc: bạn muốn giữ lại khoảnh khắc nào cho kỳ nghỉ của mình?",
  
  // ... keep existing code (testimonials section)
  testimonials_title: "Đánh Giá Từ Khách Hàng",
  testimonials_subtitle: "Khách hàng nói gì về chúng tôi",
  
  // ... keep existing code (gallery section)
  gallery_title: "Thư Viện Ảnh",
  gallery_subtitle: "Khám phá vẻ đẹp của AnNam Village",
  gallery: "Thư Viện Ảnh",
  discover_images: "Khám Phá Hình Ảnh",
  gallery_desc: "Ngắm nhìn không gian và thiết kế sang trọng của AnNam Village qua bộ sưu tập hình ảnh",
  view_more_images: "Xem Thêm Hình Ảnh",
  all: "Tất Cả",
  
  // ... keep existing code (CTA section)
  cta_title: "Đặt Phòng Ngay Hôm Nay",
  cta_subtitle: "Và Nhận Ưu Đãi Đặc Biệt",
  cta_description: "Đặt phòng trực tiếp trên website chính thức của chúng tôi để nhận được giá tốt nhất cùng nhiều ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đặt phòng online.",
  
  // ... keep existing code (footer, about page, room types page, services page, blog page, contact page, booking page, admin, admin login, error page, error messages)
  links: "Liên Kết",
  subscribe: "Đăng Ký Nhận Tin",
  subscribe_desc: "Đăng ký để nhận thông tin ưu đãi mới nhất từ chúng tôi",
  your_email: "Email của bạn",
  subscribe_btn: "Đăng Ký",
  all_rights: "Tất cả các quyền được bảo lưu",
  terms: "Điều Khoản",
  privacy: "Chính Sách Bảo Mật",
  cookies: "Cookies",
  
  our_story: "Câu Chuyện Của Chúng Tôi",
  our_mission: "Sứ Mệnh",
  our_vision: "Tầm Nhìn",
  our_values: "Giá Trị Cốt Lõi",
  our_team: "Đội Ngũ Của Chúng Tôi",
  
  filter_by: "Lọc Theo",
  price_range: "Khoảng Giá",
  guests: "Số Khách",
  amenities: "Tiện Nghi",
  view: "Tầm Nhìn",
  apply_filter: "Áp Dụng",
  reset_filter: "Đặt Lại",
  from_price: "Từ",
  per_night: "/đêm",
  
  spa_wellness: "Spa & Sức Khỏe",
  restaurant: "Nhà Hàng",
  activities: "Hoạt Động",
  
  latest_posts: "Bài Viết Mới Nhất",
  categories: "Danh Mục",
  popular_tags: "Thẻ Phổ Biến",
  search_placeholder: "Tìm kiếm bài viết...",
  
  get_in_touch: "Liên Hệ Với Chúng Tôi",
  address: "Địa Chỉ",
  phone: "Điện Thoại",
  email: "Email",
  form_name: "Họ Tên",
  form_email: "Email",
  form_subject: "Tiêu Đề",
  form_message: "Nội Dung",
  form_submit: "Gửi",
  
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
  
  admin_title: "Quản Trị",
  dashboard: "Bảng Điều Khiển",
  bookings: "Đặt Phòng",
  customers: "Khách Hàng",
  reports: "Báo Cáo",
  settings: "Cài Đặt",
  logout: "Đăng Xuất",

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
  
  error_title: "Không Tìm Thấy Trang",
  error_description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.",
  back_to_home: "Về Trang Chủ",
  
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
  amenity_open_space: "Open Space",
  amenity_open_space_desc: "A green space peaceful enough for self-reflection. Also spacious enough for friends and family to gather, sharing stories that are often forgotten in everyday life.",
  
  // About section - NEW TEXT
  about_title: "About AnNam Village",
  about_subtitle: "A peaceful pause in the heart of Vung Tau",
  about_description: "AnNam is not just accommodation – but a place for everyone to find their own quiet moments in the sun, among trees, in the breeze... From cool green architecture to intimate layouts, each villa at AnNam is there to shelter the soul, soothing the \"worn edges\" from everyday hustle and bustle...",
  about_annam: "About AnNam Village",
  villa_description: "Here, there are joys different from the everyday: a delicious meal with the extended family, an afternoon by the pool with close friends, a courtyard rustling with leaves singing in the wind, a gathering space echoing with laughter... AnNam doesn't sell a night's stay, AnNam is many places, for you to find those seemingly ordinary moments - that you haven't touched in a long time...",
  
  // Room types section - UPDATED TEXT
  room_types_title: "Choose a place to rest... just enough for your peace",
  room_types_subtitle: "AnNam has \"complete\" options for you and your loved ones to make your trip more \"perfect\": A peaceful bedroom by the sound of ocean waves.. A villa containing an entire mini forest ecosystem... A space for children to play on the grass... Or a quiet corner to sit and confide together... Which one you choose doesn't matter as much as: what moments do you want to keep for your vacation?",
  
  // ... keep existing code (testimonials section)
  testimonials_title: "Guest Testimonials",
  testimonials_subtitle: "What our guests say about us",
  
  // ... keep existing code (gallery section)
  gallery_title: "Gallery",
  gallery_subtitle: "Explore the beauty of AnNam Village",
  gallery: "Gallery",
  discover_images: "Discover Images",
  gallery_desc: "Explore the luxurious spaces and elegant design of AnNam Village through our collection of images",
  view_more_images: "View More Images",
  all: "All",
  
  // ... keep existing code (CTA section)
  cta_title: "Book Your Stay Today",
  cta_subtitle: "And Get Special Offers",
  cta_description: "Book directly on our official website to get the best price and many attractive offers exclusively for online booking customers.",
  
  // ... keep existing code (footer, about page, room types page, services page, blog page, contact page, booking page, admin, admin login, error page, error messages)
  links: "Links",
  subscribe: "Subscribe",
  subscribe_desc: "Subscribe to receive our latest offers",
  your_email: "Your email",
  subscribe_btn: "Subscribe",
  all_rights: "All rights reserved",
  terms: "Terms",
  privacy: "Privacy Policy",
  cookies: "Cookies",
  
  our_story: "Our Story",
  our_mission: "Our Mission",
  our_vision: "Our Vision",
  our_values: "Our Values",
  our_team: "Our Team",
  
  filter_by: "Filter By",
  price_range: "Price Range",
  guests: "Guests",
  amenities: "Amenities",
  view: "View",
  apply_filter: "Apply",
  reset_filter: "Reset",
  from_price: "From",
  per_night: "/night",
  
  spa_wellness: "Spa & Wellness",
  restaurant: "Restaurant",
  activities: "Activities",
  
  latest_posts: "Latest Posts",
  categories: "Categories",
  popular_tags: "Popular Tags",
  search_placeholder: "Search posts...",
  
  get_in_touch: "Get In Touch",
  address: "Address",
  phone: "Phone",
  email: "Email",
  form_name: "Name",
  form_email: "Email",
  form_subject: "Subject",
  form_message: "Message",
  form_submit: "Submit",
  
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
  
  admin_title: "Admin",
  dashboard: "Dashboard",
  bookings: "Bookings",
  customers: "Customers",
  reports: "Reports",
  settings: "Settings",
  logout: "Logout",

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
  
  error_title: "Page Not Found",
  error_description: "The page you are looking for does not exist or has been moved.",
  back_to_home: "Back to Home",
  
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
