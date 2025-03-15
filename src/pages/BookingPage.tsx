
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBooking, getRoomTypes } from '@/api/bookingApi';

const BookingPage = () => {
  const { language } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    loadRoomTypes();
  }, []);
  
  const loadRoomTypes = async () => {
    const data = await getRoomTypes();
    setRoomTypes(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut || !roomType || !fullName || !email || !phone) {
      const message = language === 'vi' 
        ? 'Vui lòng điền đầy đủ thông tin bắt buộc' 
        : 'Please fill in all required fields';
      
      const description = language === 'vi'
        ? 'Tên, email, số điện thoại, ngày đến, ngày đi và loại phòng là bắt buộc'
        : 'Name, email, phone, check-in date, check-out date, and room type are required';
      
      return;
    }
    
    setLoading(true);
    
    const bookingData = {
      fullName,
      email,
      phone,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      roomType,
      adults,
      children,
      specialRequests: specialRequests || undefined
    };
    
    try {
      const result = await createBooking(bookingData);
      
      if (result.success) {
        // Reset form on success
        setFullName('');
        setEmail('');
        setPhone('');
        setCheckIn(undefined);
        setCheckOut(undefined);
        setRoomType('');
        setSpecialRequests('');
        setAdults(2);
        setChildren(0);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img 
            src="/lovable-uploads/842f894d-4d09-4b7b-9de4-e68c7d1e2e30.png" 
            alt="Booking" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <motion.h1 
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === 'vi' ? 'Đặt Phòng' : 'Book a Room'}
          </motion.h1>
          <motion.p 
            className="text-beach-100 max-w-3xl text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {language === 'vi' 
              ? 'Đặt phòng tại Annam Village để bắt đầu kỳ nghỉ tuyệt vời của bạn tại Vũng Tàu.'
              : 'Book your stay at Annam Village to start your wonderful vacation in Vung Tau.'}
          </motion.p>
        </div>
      </div>
      
      {/* Booking Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-beach-900">
                    {language === 'vi' ? 'Thông Tin Đặt Phòng' : 'Booking Information'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">
                          {language === 'vi' ? 'Họ và tên' : 'Full Name'}*
                        </Label>
                        <Input
                          id="full-name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email*</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}*
                        </Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Date Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="check-in">{language === 'vi' ? 'Ngày Đến' : 'Check-in Date'}*</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="check-in"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkIn && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkIn ? format(checkIn, "PPP") : (language === 'vi' ? 'Chọn ngày' : 'Pick a date')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkIn}
                              onSelect={setCheckIn}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="check-out">{language === 'vi' ? 'Ngày Đi' : 'Check-out Date'}*</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="check-out"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkOut && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkOut ? format(checkOut, "PPP") : (language === 'vi' ? 'Chọn ngày' : 'Pick a date')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkOut}
                              onSelect={setCheckOut}
                              initialFocus
                              disabled={(date) => !checkIn || date <= checkIn}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    {/* Room Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="room-type">{language === 'vi' ? 'Loại Phòng' : 'Room Type'}*</Label>
                      <select 
                        id="room-type"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beach-500"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        required
                      >
                        <option value="">{language === 'vi' ? 'Chọn loại phòng' : 'Select room type'}</option>
                        {roomTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {language === 'vi' ? type.name : type.name_en} - {new Intl.NumberFormat('vi-VN').format(type.price)}đ/đêm
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Guests Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="adults">{language === 'vi' ? 'Người Lớn' : 'Adults'}</Label>
                        <select 
                          id="adults"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beach-500"
                          value={adults}
                          onChange={(e) => setAdults(parseInt(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="children">{language === 'vi' ? 'Trẻ Em' : 'Children'}</Label>
                        <select 
                          id="children"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beach-500"
                          value={children}
                          onChange={(e) => setChildren(parseInt(e.target.value))}
                        >
                          {[0, 1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Special Requests */}
                    <div className="space-y-2">
                      <Label htmlFor="special-requests">
                        {language === 'vi' ? 'Yêu cầu đặc biệt' : 'Special Requests'}
                      </Label>
                      <Textarea
                        id="special-requests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder={language === 'vi' 
                          ? 'Các yêu cầu đặc biệt (nếu có)' 
                          : 'Any special requests (if any)'
                        }
                        rows={4}
                      />
                    </div>
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading 
                        ? (language === 'vi' ? 'Đang xử lý...' : 'Processing...') 
                        : (language === 'vi' ? 'Đặt Phòng Ngay' : 'Book Now')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Booking Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-beach-50">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-beach-900">
                    {language === 'vi' ? 'Thông Tin Liên Hệ' : 'Contact Information'}
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-beach-800">
                      <strong>{language === 'vi' ? 'Địa Chỉ:' : 'Address:'}</strong><br />
                      {language === 'vi' 
                        ? '123 Đường Ven Biển, Phường 10, Thành phố Vũng Tàu, Việt Nam' 
                        : '123 Coastal Road, Ward 10, Vung Tau City, Vietnam'}
                    </p>
                    
                    <p className="text-beach-800">
                      <strong>{language === 'vi' ? 'Điện Thoại:' : 'Phone:'}</strong><br />
                      +84 909 123 456
                    </p>
                    
                    <p className="text-beach-800">
                      <strong>Email:</strong><br />
                      info@annamvillage.vn
                    </p>
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-bold text-beach-900">
                      {language === 'vi' ? 'Chính Sách Đặt Phòng' : 'Booking Policy'}
                    </h3>
                    
                    <ul className="list-disc list-inside space-y-2 text-beach-800">
                      <li>
                        {language === 'vi' 
                          ? 'Thời gian nhận phòng: Sau 14:00' 
                          : 'Check-in time: After 14:00'}
                      </li>
                      <li>
                        {language === 'vi' 
                          ? 'Thời gian trả phòng: Trước 12:00' 
                          : 'Check-out time: Before 12:00'}
                      </li>
                      <li>
                        {language === 'vi' 
                          ? 'Đặt cọc: 30% giá trị đặt phòng' 
                          : 'Deposit: 30% of booking value'}
                      </li>
                      <li>
                        {language === 'vi' 
                          ? 'Hủy miễn phí: 7 ngày trước ngày đến' 
                          : 'Free cancellation: 7 days before arrival date'}
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default BookingPage;
