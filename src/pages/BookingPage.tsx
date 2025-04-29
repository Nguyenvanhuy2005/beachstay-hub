
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRoomTypes } from '@/api/bookingApi';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingForm from '@/components/booking/BookingForm';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const BookingPage = () => {
  const { language } = useLanguage();
  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching room types for booking page...');
        const roomTypesData = await getRoomTypes();
        console.log(`Fetched ${roomTypesData.length} room types`);
        setRoomTypes(roomTypesData);
        
        if (roomTypesData.length === 0) {
          console.warn('No room types found');
          setError(language === 'vi' 
            ? 'Không có loại phòng nào. Vui lòng thêm loại phòng trong trang quản trị.' 
            : 'No room types found. Please add room types in the admin page.'
          );
        }
      } catch (error) {
        console.error('Error fetching room types:', error);
        setError(language === 'vi' 
          ? 'Không thể tải danh sách phòng. Vui lòng thử lại sau.' 
          : 'Could not load room types. Please try again later.'
        );
        toast({
          title: language === 'vi' ? 'Lỗi khi tải dữ liệu' : 'Error loading data',
          description: language === 'vi' 
            ? 'Không thể tải loại phòng. Vui lòng thử lại sau.' 
            : 'Could not load room types. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomTypes();
  }, [language, toast]);

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {language === 'vi' ? 'Đặt phòng' : 'Book a Room'}
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">
                {language === 'vi' ? 'Thông tin đặt phòng chi tiết' : 'Booking Information'}
              </CardTitle>
              <CardDescription className="text-center">
                {language === 'vi' 
                  ? 'Vui lòng điền đầy đủ thông tin để đặt phòng' 
                  : 'Please fill in all information to book a room'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-beach-600" />
                    <p>{language === 'vi' ? 'Đang tải thông tin phòng...' : 'Loading room information...'}</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center text-red-700">
                  <p>{error}</p>
                </div>
              ) : (
                <BookingForm roomTypes={roomTypes} isLoading={isLoading} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingPage;
