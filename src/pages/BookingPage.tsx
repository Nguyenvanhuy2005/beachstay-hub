
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createBooking, getRoomTypes, checkRoomAvailability } from '@/api/bookingApi';
import { toast } from 'sonner';

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
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [roomAvailability, setRoomAvailability] = useState<{available: boolean, remainingRooms?: number}>({available: true});
  
  useEffect(() => {
    window.scrollTo(0, 0);
    loadRoomTypes();
  }, []);
  
  const loadRoomTypes = async () => {
    const data = await getRoomTypes();
    setRoomTypes(data);
  };

  // Check availability when room type and dates are selected
  useEffect(() => {
    if (roomType && checkIn && checkOut) {
      checkAvailability();
    }
  }, [roomType, checkIn, checkOut]);

  const checkAvailability = async () => {
    if (!roomType || !checkIn || !checkOut) return;
    
    const checkInStr = checkIn.toISOString().split('T')[0];
    const checkOutStr = checkOut.toISOString().split('T')[0];
    
    const result = await checkRoomAvailability(roomType, checkInStr, checkOutStr);
    setRoomAvailability(result);
    
    if (!result.available) {
      toast.error(language === 'vi' 
        ? 'Phòng đã hết chỗ cho ngày bạn chọn' 
        : 'This room is not available for the selected dates');
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!fullName) {
      errors.fullName = language === 'vi' ? 'Vui lòng nhập họ tên' : 'Please enter your full name';
    }
    
    if (!email) {
      errors.email = language === 'vi' ? 'Vui lòng nhập email' : 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = language === 'vi' ? 'Email không hợp lệ' : 'Invalid email address';
    }
    
    if (!phone) {
      errors.phone = language === 'vi' ? 'Vui lòng nhập số điện thoại' : 'Please enter your phone number';
    }
    
    if (!checkIn) {
      errors.checkIn = language === 'vi' ? 'Vui lòng chọn ngày đến' : 'Please select check-in date';
    }
    
    if (!checkOut) {
      errors.checkOut = language === 'vi' ? 'Vui lòng chọn ngày đi' : 'Please select check-out date';
    }
    
    if (!roomType) {
      errors.roomType = language === 'vi' ? 'Vui lòng chọn loại phòng' : 'Please select a room type';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(language === 'vi' 
        ? 'Vui lòng điền đầy đủ thông tin bắt buộc' 
        : 'Please fill in all required fields');
      return;
    }

    if (!roomAvailability.available) {
      toast.error(language === 'vi' 
        ? 'Phòng đã hết chỗ cho ngày bạn chọn' 
        : 'This room is not available for the selected dates');
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
    
    console.log('Submitting booking data:', bookingData);
    
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
    } catch (error) {
      console.error('Error during booking submission:', error);
      toast.error(language === 'vi' 
        ? 'Đã xảy ra lỗi khi đặt phòng. Vui lòng thử lại sau.' 
        : 'An error occurred during booking. Please try again later.');
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
                        <Label htmlFor="full-name" className={cn(formErrors.fullName && "text-destructive")}>
                          {language === 'vi' ? 'Họ và tên' : 'Full Name'}*
                        </Label>
                        <Input
                          id="full-name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={cn(formErrors.fullName && "border-destructive")}
                          required
                        />
                        {formErrors.fullName && <p className="text-destructive text-sm">{formErrors.fullName}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className={cn(formErrors.email && "text-destructive")}>Email*</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={cn(formErrors.email && "border-destructive")}
                          required
                        />
                        {formErrors.email && <p className="text-destructive text-sm">{formErrors.email}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className={cn(formErrors.phone && "text-destructive")}>
                          {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}*
                        </Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={cn(formErrors.phone && "border-destructive")}
                          required
                        />
                        {formErrors.phone && <p className="text-destructive text-sm">{formErrors.phone}</p>}
                      </div>
                    </div>
                    
                    {/* Date Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="check-in" className={cn(formErrors.checkIn && "text-destructive")}>
                          {language === 'vi' ? 'Ngày Đến' : 'Check-in Date'}*
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="check-in"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkIn && "text-muted-foreground",
                                formErrors.checkIn && "border-destructive text-destructive"
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
                        {formErrors.checkIn && <p className="text-destructive text-sm">{formErrors.checkIn}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="check-out" className={cn(formErrors.checkOut && "text-destructive")}>
                          {language === 'vi' ? 'Ngày Đi' : 'Check-out Date'}*
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="check-out"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkOut && "text-muted-foreground",
                                formErrors.checkOut && "border-destructive text-destructive"
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
                        {formErrors.checkOut && <p className="text-destructive text-sm">{formErrors.checkOut}</p>}
                      </div>
                    </div>
                    
                    {/* Room Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="room-type" className={cn(formErrors.roomType && "text-destructive")}>
                        {language === 'vi' ? 'Loại Phòng' : 'Room Type'}*
                      </Label>
                      <select 
                        id="room-type"
                        className={cn(
                          "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beach-500",
                          formErrors.roomType && "border-destructive"
                        )}
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
                      {formErrors.roomType && <p className="text-destructive text-sm">{formErrors.roomType}</p>}
                    </div>

                    {/* Availability Alert */}
                    {roomType && checkIn && checkOut && !roomAvailability.available && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {language === 'vi'
                            ? 'Phòng này đã hết chỗ cho ngày bạn chọn. Vui lòng chọn ngày khác hoặc loại phòng khác.'
                            : 'This room is not available for the selected dates. Please choose different dates or a different room type.'}
                        </AlertDescription>
                      </Alert>
                    )}

                    {roomType && checkIn && checkOut && roomAvailability.available && roomAvailability.remainingRooms !== undefined && roomAvailability.remainingRooms <= 2 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {language === 'vi'
                            ? `Chỉ còn ${roomAvailability.remainingRooms} phòng trống cho ngày bạn chọn!`
                            : `Only ${roomAvailability.remainingRooms} rooms left for your selected dates!`}
                        </AlertDescription>
                      </Alert>
                    )}
                    
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
                      disabled={loading || (roomType && checkIn && checkOut && !roomAvailability.available)}
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
                  
                  {/* Booking Status Explanation */}
                  <div className="mt-8 p-4 bg-beach-100/50 rounded-lg">
                    <h3 className="text-lg font-bold text-beach-900 mb-3">
                      {language === 'vi' ? 'Trạng Thái Đặt Phòng' : 'Booking Status'}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="text-sm">
                          <strong>{language === 'vi' ? 'Chờ xác nhận:' : 'Pending:'}</strong> {' '}
                          {language === 'vi' 
                            ? 'Đơn đặt phòng đã được ghi nhận và đang chờ xác nhận từ nhân viên.' 
                            : 'Your booking has been received and is waiting for confirmation.'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm">
                          <strong>{language === 'vi' ? 'Đã xác nhận:' : 'Confirmed:'}</strong> {' '}
                          {language === 'vi' 
                            ? 'Đơn đặt phòng đã được xác nhận và phòng đã được giữ cho bạn.' 
                            : 'Your booking has been confirmed and the room has been reserved for you.'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-sm">
                          <strong>{language === 'vi' ? 'Đã hủy:' : 'Cancelled:'}</strong> {' '}
                          {language === 'vi' 
                            ? 'Đơn đặt phòng đã bị hủy.' 
                            : 'Your booking has been cancelled.'}
                        </span>
                      </div>
                    </div>
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
