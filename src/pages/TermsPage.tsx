
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const TermsPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="relative bg-beach-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/90 to-beach-800/80 z-10"></div>
          <img 
            src="/lovable-uploads/c18e6a42-2847-481c-bd63-68861f4e2423.png" 
            alt="Terms and Conditions" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-16 md:py-24">
          <motion.h1 
            className="font-display text-4xl md:text-5xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === 'vi' ? 'Điều Khoản Sử Dụng' : 'Terms and Conditions'}
          </motion.h1>
        </div>
      </div>
      
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {language === 'vi' ? (
                <>
                  <h2 className="font-display text-2xl text-beach-800 mb-6">1. Điều khoản chung</h2>
                  <p className="mb-6">
                    Chào mừng bạn đến với Annam Village. Khi truy cập và sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng trang web của chúng tôi.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">2. Đặt phòng và thanh toán</h2>
                  <p className="mb-6">
                    Khi đặt phòng tại Annam Village, bạn đảm bảo rằng bạn đủ 18 tuổi trở lên và có đầy đủ thẩm quyền pháp lý để tham gia vào một hợp đồng ràng buộc. Bạn cũng đồng ý cung cấp thông tin thanh toán chính xác và đầy đủ.
                  </p>
                  <p className="mb-6">
                    Chúng tôi yêu cầu đặt cọc 30% giá trị đơn đặt phòng để xác nhận đặt phòng của bạn. Số tiền còn lại phải được thanh toán ít nhất 7 ngày trước ngày nhận phòng của bạn. Đối với đặt phòng trong vòng 7 ngày kể từ ngày đến, chúng tôi yêu cầu thanh toán đầy đủ tại thời điểm đặt phòng.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">3. Chính sách hủy đặt phòng</h2>
                  <p className="mb-6">
                    Nếu bạn hủy đặt phòng ít nhất 30 ngày trước ngày đến dự kiến, bạn sẽ nhận được hoàn tiền đầy đủ. Đối với việc hủy trong vòng 15-29 ngày trước khi đến, bạn sẽ được hoàn lại 50% tiền đặt cọc. Không hoàn tiền cho việc hủy trong vòng 14 ngày trước ngày đến.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">4. Quy tắc resort</h2>
                  <p className="mb-6">
                    Thời gian nhận phòng tiêu chuẩn là 14:00 và thời gian trả phòng là 12:00. Nhận phòng sớm và trả phòng muộn có thể được sắp xếp tùy thuộc vào tình trạng sẵn có và có thể phát sinh phí bổ sung.
                  </p>
                  <p className="mb-6">
                    Khách có trách nhiệm đối với bất kỳ thiệt hại nào đối với tài sản resort do họ hoặc khách của họ gây ra. Annam Village có quyền tính phí thẻ tín dụng đã đăng ký của khách để sửa chữa bất kỳ thiệt hại nào.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">5. Quyền và trách nhiệm của resort</h2>
                  <p className="mb-6">
                    Annam Village có quyền từ chối phục vụ hoặc chấm dứt việc lưu trú của bất kỳ khách nào có hành vi sai trái, gây rối hoặc vi phạm các điều khoản và điều kiện của chúng tôi.
                  </p>
                  <p className="mb-6">
                    Chúng tôi không chịu trách nhiệm về bất kỳ mất mát hoặc thiệt hại nào đối với tài sản cá nhân của khách trong thời gian lưu trú tại resort. Khách được khuyến khích sử dụng két an toàn trong phòng hoặc tại quầy lễ tân cho các vật dụng có giá trị.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">6. Thay đổi điều khoản</h2>
                  <p className="mb-6">
                    Annam Village có quyền sửa đổi hoặc cập nhật các điều khoản và điều kiện này vào bất kỳ lúc nào. Những thay đổi này sẽ có hiệu lực ngay sau khi được đăng trên trang web của chúng tôi. Việc bạn tiếp tục sử dụng trang web sau khi những thay đổi này sẽ cấu thành việc bạn chấp nhận các điều khoản đã sửa đổi.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">7. Liên hệ</h2>
                  <p className="mb-6">
                    Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng của chúng tôi, vui lòng liên hệ với chúng tôi qua email tại info@annamvillage.vn hoặc qua điện thoại theo số +84 909 123 456.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl text-beach-800 mb-6">1. General Terms</h2>
                  <p className="mb-6">
                    Welcome to Annam Village. By accessing and using our website, you agree to comply with the terms and conditions set out in this document. If you do not agree with any part of these terms, please do not use our website.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">2. Reservations and Payment</h2>
                  <p className="mb-6">
                    When making a reservation at Annam Village, you warrant that you are at least 18 years of age and possess the legal authority to enter into a binding agreement. You also agree to provide accurate and complete payment information.
                  </p>
                  <p className="mb-6">
                    We require a deposit of 30% of the booking value to confirm your reservation. The remaining balance must be paid at least 7 days prior to your check-in date. For bookings made within 7 days of arrival, we require full payment at the time of booking.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">3. Cancellation Policy</h2>
                  <p className="mb-6">
                    If you cancel your reservation at least 30 days before your scheduled arrival date, you will receive a full refund. For cancellations made 15-29 days before arrival, you will be refunded 50% of your deposit. No refunds for cancellations made within 14 days of arrival.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">4. Resort Rules</h2>
                  <p className="mb-6">
                    Standard check-in time is 14:00 and check-out time is 12:00. Early check-in and late check-out can be arranged subject to availability and may incur additional charges.
                  </p>
                  <p className="mb-6">
                    Guests are responsible for any damage to resort property caused by themselves or their guests. Annam Village reserves the right to charge the guest's registered credit card for the repair of any damages.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">5. Rights and Responsibilities of the Resort</h2>
                  <p className="mb-6">
                    Annam Village reserves the right to refuse service or terminate the stay of any guest engaging in misconduct, causing disturbance, or violating our terms and conditions.
                  </p>
                  <p className="mb-6">
                    We are not responsible for any loss or damage to guests' personal property during their stay at the resort. Guests are encouraged to use the in-room safe or the one at the reception for valuables.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">6. Changes to Terms</h2>
                  <p className="mb-6">
                    Annam Village reserves the right to modify or update these terms and conditions at any time. These changes will be effective immediately upon posting on our website. Your continued use of the website following such changes will constitute your acceptance of the modified terms.
                  </p>
                  
                  <h2 className="font-display text-2xl text-beach-800 mb-6">7. Contact Us</h2>
                  <p className="mb-6">
                    If you have any questions about our Terms of Use, please contact us via email at info@annamvillage.vn or by phone at +84 909 123 456.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default TermsPage;
