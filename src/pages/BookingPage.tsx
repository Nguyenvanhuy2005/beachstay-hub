
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRoomTypes } from '@/api/bookingApi';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingForm from '@/components/booking/BookingForm';
import QuickBookingForm from '@/components/booking/QuickBookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookingPage = () => {
  const { language } = useLanguage();
  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("full");

  useEffect(() => {
    const fetchRoomTypes = async () => {
      setIsLoading(true);
      const roomTypesData = await getRoomTypes();
      setRoomTypes(roomTypesData);
      setIsLoading(false);
    };

    fetchRoomTypes();
  }, []);

  const handleFullBooking = () => {
    setActiveTab("full");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          {language === 'vi' ? 'Đặt phòng' : 'Book a Room'}
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="quick">
                {language === 'vi' ? 'Đặt nhanh' : 'Quick Booking'}
              </TabsTrigger>
              <TabsTrigger value="full">
                {language === 'vi' ? 'Đặt chi tiết' : 'Full Booking'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quick" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'vi' ? 'Đặt phòng nhanh' : 'Quick Booking'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'vi' 
                      ? 'Đặt phòng nhanh chóng với thông tin cơ bản' 
                      : 'Book a room quickly with basic information'
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <QuickBookingForm onFullBooking={handleFullBooking} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="full" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'vi' ? 'Thông tin đặt phòng chi tiết' : 'Detailed Booking Information'}
                  </CardTitle>
                  <CardDescription>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingPage;
