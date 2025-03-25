
export type Language = 'vi' | 'en';

export type TranslationKey = keyof typeof translations.en | keyof typeof translations.vi;

// Define translations
export const translations = {
  vi: {
    // Navigation
    'home': 'Trang Chủ',
    'about': 'Về Chúng Tôi',
    'rooms': 'Loại Phòng',
    'services': 'Dịch Vụ',
    'blog': 'Blog',
    'contact': 'Liên Hệ',
    'book_now': 'Đặt Phòng',
    
    // CTA Section
    'book_today': 'Đặt Phòng Ngay Hôm Nay',
    'special_offers': 'Và Nhận Ưu Đãi Đặc Biệt',
    'book_direct': 'Đặt phòng trực tiếp trên website chính thức của chúng tôi để nhận được giá tốt nhất cùng nhiều ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đặt phòng online.',
    'book_now_btn': 'Đặt Phòng Ngay',
    'view_offers': 'Xem Ưu Đãi',
    
    // Benefits
    'best_price': 'Giá tốt nhất đảm bảo',
    'exclusive_offers': 'Ưu đãi độc quyền chỉ có trên website',
    'quick_booking': 'Đặt phòng nhanh chóng, dễ dàng',
    'free_cancel': 'Hủy miễn phí trước 7 ngày',
    'secure_payment': 'Thanh toán an toàn, bảo mật',
    
    // Footer
    'links': 'Liên Kết',
    'subscribe': 'Đăng Ký Nhận Tin',
    'subscribe_desc': 'Đăng ký để nhận thông tin ưu đãi và tin tức mới nhất từ Annam Village.',
    'your_email': 'Email của bạn',
    'subscribe_btn': 'Đăng Ký',
    'all_rights': 'Tất cả quyền được bảo lưu.',
    'terms': 'Điều Khoản',
    'privacy': 'Bảo Mật',
    'cookies': 'Cookie',
    
    // About Section
    'about_annam': 'Về Annam Village',
    'about_description': 'Annam Village là chuỗi biệt thự, căn hộ cho thuê ngắn ngày tại thành phố biển Vũng Tàu. Với thiết kế độc đáo kết hợp giữa kiến trúc hiện đại và nét đẹp truyền thống, chúng tôi mang đến cho bạn không gian nghỉ dưỡng lý tưởng, nơi hòa mình vào thiên nhiên và thư giãn tuyệt đối.',
    'villa_description': 'Mỗi căn biệt thự đều được thiết kế tỉ mỉ với đầy đủ tiện nghi hiện đại, không gian xanh, hồ bơi riêng và dịch vụ chuyên nghiệp, đảm bảo mang đến trải nghiệm nghỉ dưỡng khó quên cho bạn và người thân.',
    'learn_more': 'Tìm Hiểu Thêm',
    
    // Gallery Section
    'gallery': 'Thư Viện Ảnh',
    'discover_images': 'Khám Phá Annam Village Qua Hình Ảnh',
    'gallery_desc': 'Ngắm nhìn không gian sống đẳng cấp và tiện nghi hiện đại tại Annam Village qua bộ sưu tập hình ảnh được tuyển chọn kỹ lưỡng.',
    'view_more_images': 'Xem Thêm Hình Ảnh',
    'all': 'Tất Cả',
    
    // Testimonials Section
    'testimonials': 'Đánh Giá',
    'testimonials_title': 'Khách Hàng Nói Gì Về Chúng Tôi',
    'testimonials_desc': 'Hãy xem khách hàng đã trải nghiệm dịch vụ của chúng tôi nói gì về Annam Village.',
    'customer': 'Khách Hàng',
    
    // Quick Booking Form
    'quick_booking': 'Đặt Phòng Nhanh',
    'full_name': 'Họ và tên',
    'enter_name': 'Nhập họ và tên',
    'email_address': 'Địa chỉ email',
    'enter_email': 'Nhập địa chỉ email',
    'phone_number': 'Số điện thoại',
    'enter_phone': 'Nhập số điện thoại',
    'room_type': 'Loại phòng',
    'select_room': 'Chọn loại phòng',
    'standard_room': 'Phòng Tiêu Chuẩn',
    'deluxe_room': 'Phòng Deluxe',
    'suite_room': 'Phòng Suite',
    'villa': 'Biệt Thự',
    'select_date': 'Chọn ngày ở',
    'select_checkin_out': 'Chọn ngày nhận và trả phòng',
    'submit_request': 'Gửi Yêu Cầu',
    'detailed_booking': 'Đặt phòng chi tiết hơn',
    
    // Error and Success Messages
    'error_loading_data': 'Lỗi tải dữ liệu',
    'error_loading_gallery': 'Không thể tải hình ảnh thư viện từ máy chủ, đang sử dụng dữ liệu dự phòng',
    'please_fill_all': 'Vui lòng điền đầy đủ thông tin đặt phòng!',
    'booking_success': 'Yêu cầu đặt phòng đã được gửi thành công!',
    'try_again': 'Thử lại',
    
    // HeroSection 
    'premium_amenities': 'Tiện Nghi Đẳng Cấp',
    'premium_amenities_desc': 'Phòng nghỉ sang trọng với đầy đủ tiện nghi hiện đại',
    'peaceful_space': 'Không Gian Bình Yên',
    'peaceful_space_desc': 'Nơi hòa mình vào thiên nhiên và thư giãn tuyệt đối',
    'luxury_experience': 'Trải Nghiệm Sang Trọng',
    'luxury_experience_desc': 'Cùng thiết kế độc đáo kết hợp hiện đại và truyền thống',
    'book_now_action': 'Đặt Phòng Ngay',
    'explore': 'Khám Phá',
  },
  en: {
    // Navigation
    'home': 'Home',
    'about': 'About Us',
    'rooms': 'Room Types',
    'services': 'Services',
    'blog': 'Blog',
    'contact': 'Contact',
    'book_now': 'Book Now',
    
    // CTA Section
    'book_today': 'Book Your Stay Today',
    'special_offers': 'And Get Special Offers',
    'book_direct': 'Book directly on our official website to get the best price and many attractive offers exclusively for online booking customers.',
    'book_now_btn': 'Book Now',
    'view_offers': 'View Offers',
    
    // Benefits
    'best_price': 'Best price guarantee',
    'exclusive_offers': 'Exclusive offers only on our website',
    'quick_booking': 'Quick and easy booking',
    'free_cancel': 'Free cancellation before 7 days',
    'secure_payment': 'Secure payment',
    
    // Footer
    'links': 'Links',
    'subscribe': 'Subscribe',
    'subscribe_desc': 'Subscribe to receive promotions and latest news from Annam Village.',
    'your_email': 'Your email',
    'subscribe_btn': 'Subscribe',
    'all_rights': 'All rights reserved.',
    'terms': 'Terms',
    'privacy': 'Privacy',
    'cookies': 'Cookies',
    
    // About Section
    'about_annam': 'About Annam Village',
    'about_description': 'Annam Village is a chain of villas and apartments for short-term rental in the coastal city of Vung Tau. With a unique design combining modern architecture and traditional beauty, we bring you an ideal retreat space where you can immerse yourself in nature and relax completely.',
    'villa_description': 'Each villa is meticulously designed with all modern amenities, green spaces, private pools, and professional services, ensuring an unforgettable vacation experience for you and your loved ones.',
    'learn_more': 'Learn More',
    
    // Gallery Section
    'gallery': 'Photo Gallery',
    'discover_images': 'Discover Annam Village Through Images',
    'gallery_desc': 'View the elegant living spaces and modern amenities at Annam Village through our carefully curated collection of images.',
    'view_more_images': 'View More Images',
    'all': 'All',
    
    // Testimonials Section
    'testimonials': 'Testimonials',
    'testimonials_title': 'What Our Guests Say About Us',
    'testimonials_desc': 'See what guests who have experienced our service say about Annam Village.',
    'customer': 'Customer',
    
    // Quick Booking Form
    'quick_booking': 'Quick Booking',
    'full_name': 'Full Name',
    'enter_name': 'Enter your full name',
    'email_address': 'Email Address',
    'enter_email': 'Enter your email address',
    'phone_number': 'Phone Number',
    'enter_phone': 'Enter your phone number',
    'room_type': 'Room Type',
    'select_room': 'Select room type',
    'standard_room': 'Standard Room',
    'deluxe_room': 'Deluxe Room',
    'suite_room': 'Suite Room',
    'villa': 'Villa',
    'select_date': 'Select Stay Date',
    'select_checkin_out': 'Select check-in and check-out dates',
    'submit_request': 'Submit Request',
    'detailed_booking': 'Make a more detailed booking',
    
    // Error and Success Messages
    'error_loading_data': 'Error loading data',
    'error_loading_gallery': 'Could not load gallery images from server, using fallback data',
    'please_fill_all': 'Please fill in all booking information!',
    'booking_success': 'Booking request has been sent successfully!',
    'try_again': 'Try Again',
    
    // HeroSection
    'premium_amenities': 'Premium Amenities',
    'premium_amenities_desc': 'Luxurious rooms with all modern amenities',
    'peaceful_space': 'Peaceful Space',
    'peaceful_space_desc': 'Where you can immerse yourself in nature and relax completely',
    'luxury_experience': 'Luxury Experience',
    'luxury_experience_desc': 'With unique design combining modern and traditional elements',
    'book_now_action': 'Book Now',
    'explore': 'Explore',
  }
};
