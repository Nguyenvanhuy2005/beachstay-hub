
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const BookingSuccessPage = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const { bookingId, bookingDetails } = location.state || {};

  if (!bookingDetails) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'vi' ? 'Không tìm thấy thông tin đặt phòng' : 'Booking information not found'}
          </h1>
          <p className="mb-6">
            {language === 'vi' 
              ? 'Dữ liệu đặt phòng không khả dụng. Vui lòng thử đặt phòng lại.' 
              : 'Booking data is not available. Please try booking again.'
            }
          </p>
          <Button asChild>
            <Link to="/dat-phong">
              {language === 'vi' ? 'Quay lại trang đặt phòng' : 'Back to booking page'}
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'vi' ? 'Đặt phòng thành công!' : 'Booking successful!'}
          </h1>
          <p className="text-gray-600">
            {language === 'vi' 
              ? 'Cảm ơn bạn đã đặt phòng tại A.N Village. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.' 
              : 'Thank you for booking with A.N Village. We will contact you as soon as possible.'
            }
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {language === 'vi' ? 'Chi tiết đặt phòng' : 'Booking Details'}
            </CardTitle>
            <CardDescription>
              {language === 'vi' ? 'Mã đặt phòng' : 'Booking ID'}: {bookingId}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'vi' ? 'Thông tin khách hàng' : 'Customer Information'}
                </h3>
                <p className="mt-1 font-medium">{bookingDetails.fullName}</p>
                <p className="text-gray-600">{bookingDetails.email}</p>
                <p className="text-gray-600">{bookingDetails.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'vi' ? 'Thông tin đặt phòng' : 'Booking Information'}
                </h3>
                <p className="mt-1">
                  <span className="font-medium">
                    {language === 'vi' ? 'Nhận phòng' : 'Check-in'}:
                  </span> {' '}
                  {format(parseISO(bookingDetails.checkIn), 'dd/MM/yyyy')}
                </p>
                <p>
                  <span className="font-medium">
                    {language === 'vi' ? 'Trả phòng' : 'Check-out'}:
                  </span> {' '}
                  {format(parseISO(bookingDetails.checkOut), 'dd/MM/yyyy')}
                </p>
                <p>
                  <span className="font-medium">
                    {language === 'vi' ? 'Số người' : 'Guests'}:
                  </span> {' '}
                  {bookingDetails.adults} {language === 'vi' ? 'người lớn' : 'adults'}, {' '}
                  {bookingDetails.children} {language === 'vi' ? 'trẻ em' : 'children'}
                </p>
              </div>
            </div>
            
            {bookingDetails.specialRequests && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {language === 'vi' ? 'Yêu cầu đặc biệt' : 'Special Requests'}
                </h3>
                <p className="mt-1 text-gray-700">{bookingDetails.specialRequests}</p>
              </div>
            )}
            
            <div className="rounded-lg bg-green-50 p-4 border border-green-100 mt-4">
              <p className="text-green-800 text-sm">
                {language === 'vi' 
                  ? 'Xác nhận đặt phòng đã được gửi đến email của bạn. Trạng thái đặt phòng hiện tại là "Chờ xác nhận".' 
                  : 'A booking confirmation has been sent to your email. Your booking status is currently "Pending".'
                }
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                {language === 'vi' ? 'Trở về trang chủ' : 'Back to home'}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BookingSuccessPage;
