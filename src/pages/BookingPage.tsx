
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRoomTypes } from '@/api/bookingApi';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingForm from '@/components/booking/BookingForm';
import { useToast } from '@/hooks/use-toast';

const BookingPage = () => {
  const { language } = useLanguage();
  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      setIsLoading(true);
      try {
        const roomTypesData = await getRoomTypes();
        setRoomTypes(roomTypesData);
      } catch (error) {
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
              <BookingForm roomTypes={roomTypes} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingPage;
