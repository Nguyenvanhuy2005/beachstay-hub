
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays, isAfter, isBefore, parse, eachDayOfInterval, isSameDay, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import PricedCalendar from '@/components/booking/PricedCalendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookingFormData, createBooking } from '@/api/bookingApi';
import { checkRoomAvailability, getBookedDatesForRoomType, getRoomPriceForDate } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRoomTypes } from '@/api/bookingApi';

const bookingFormSchema = z.object({
  fullName: z.string().min(3, { message: 'Họ tên phải có ít nhất 3 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  phone: z.string().min(10, { message: 'Số điện thoại phải có ít nhất 10 số' }),
  checkIn: z.string().min(1, { message: 'Vui lòng chọn ngày nhận phòng' }),
  checkOut: z.string().min(1, { message: 'Vui lòng chọn ngày trả phòng' }),
  roomType: z.string().min(1, { message: 'Vui lòng chọn loại phòng' }),
  adults: z.number().min(1, { message: 'Ít nhất 1 người lớn' }).max(10, { message: 'Tối đa 10 người lớn' }),
  children: z.number().min(0, { message: 'Số trẻ em không thể âm' }).max(10, { message: 'Tối đa 10 trẻ em' }),
  specialRequests: z.string().optional(),
}).refine((data) => {
  const checkIn = parse(data.checkIn, 'yyyy-MM-dd', new Date());
  const checkOut = parse(data.checkOut, 'yyyy-MM-dd', new Date());
  return isAfter(checkOut, checkIn);
}, {
  message: "Ngày trả phòng phải sau ngày nhận phòng",
  path: ["checkOut"],
});

const BookingPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState({ 
    checked: false, 
    available: true, 
    remainingRooms: 0 
  });
  
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [bookedDateRanges, setBookedDateRanges] = useState<{start: Date, end: Date}[]>([]);
  
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date, to: Date } | undefined>(undefined);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  
  const form = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      checkIn: format(new Date(), 'yyyy-MM-dd'),
      checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      roomType: '',
      adults: 2,
      children: 0,
      specialRequests: '',
    },
  });

  useEffect(() => {
    const fetchRoomTypes = async () => {
      setIsLoading(true);
      const roomTypesData = await getRoomTypes();
      setRoomTypes(roomTypesData);
      setIsLoading(false);
    };

    fetchRoomTypes();
  }, []);

  useEffect(() => {
    const roomType = form.watch('roomType');
    if (roomType) {
      const room = roomTypes.find((r: any) => r.id === roomType);
      setSelectedRoom(room || null);
    } else {
      setSelectedRoom(null);
    }
  }, [form.watch('roomType'), roomTypes]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      const roomType = form.watch('roomType');
      if (!roomType) return;

      try {
        console.log('Fetching booked dates for room type:', roomType);
        const bookedDateRanges = await getBookedDatesForRoomType(roomType);
        console.log('Booked date ranges:', bookedDateRanges);
        
        const dateRanges = bookedDateRanges.map(booking => ({
          start: new Date(booking.check_in),
          end: new Date(booking.check_out)
        }));
        setBookedDateRanges(dateRanges);
        
        const allBookedDates: Date[] = [];
        
        bookedDateRanges.forEach(booking => {
          const startDate = new Date(booking.check_in);
          const endDate = new Date(booking.check_out);
          
          const datesInRange = eachDayOfInterval({ start: startDate, end: endDate });
          allBookedDates.push(...datesInRange);
        });
        
        setBookedDates(allBookedDates);
        console.log('All booked dates:', allBookedDates.length);
      } catch (error) {
        console.error('Error fetching booked dates:', error);
        toast.error('Không thể tải dữ liệu ngày đã đặt. Vui lòng thử lại sau.');
      }
    };
    
    fetchBookedDates();
  }, [form.watch('roomType')]);

  // Calculate total price when dates and room are selected
  useEffect(() => {
    const calculateTotalPrice = async () => {
      const roomType = form.watch('roomType');
      const checkIn = form.watch('checkIn');
      const checkOut = form.watch('checkOut');
      
      if (!roomType || !checkIn || !checkOut || !selectedRoom) {
        setTotalPrice(null);
        return;
      }
      
      try {
        const checkInDate = parse(checkIn, 'yyyy-MM-dd', new Date());
        const checkOutDate = parse(checkOut, 'yyyy-MM-dd', new Date());
        
        if (!isAfter(checkOutDate, checkInDate)) {
          setTotalPrice(null);
          return;
        }
        
        // Calculate nights
        const nights = differenceInDays(checkOutDate, checkInDate);
        
        if (nights <= 0) {
          setTotalPrice(null);
          return;
        }
        
        // Get all dates in the range
        const dates = eachDayOfInterval({ 
          start: checkInDate, 
          end: new Date(checkOutDate.getTime() - 1) // Exclude checkout day
        });
        
        // Calculate price for each night
        let sum = 0;
        
        for (const date of dates) {
          // Get price for this specific date
          const price = await getRoomPriceForDate(roomType, format(date, 'yyyy-MM-dd'));
          sum += price || selectedRoom.price;
        }
        
        setTotalPrice(sum);
      } catch (error) {
        console.error('Error calculating total price:', error);
        setTotalPrice(null);
      }
    };
    
    calculateTotalPrice();
  }, [form.watch('roomType'), form.watch('checkIn'), form.watch('checkOut'), selectedRoom]);

  useEffect(() => {
    const checkAvailability = async () => {
      const roomType = form.watch('roomType');
      const checkIn = form.watch('checkIn');
      const checkOut = form.watch('checkOut');
      
      if (roomType && checkIn && checkOut) {
        try {
          const result = await checkRoomAvailability(roomType, checkIn, checkOut);
          setAvailabilityStatus({ 
            checked: true, 
            available: result.available,
            remainingRooms: result.remainingRooms || 0
          });
          
          if (!result.available) {
            toast.warning('Phòng đã hết chỗ cho ngày bạn chọn! Vui lòng chọn ngày khác hoặc loại phòng khác.');
          } else if (result.remainingRooms <= 2) {
            toast.warning(`Chỉ còn ${result.remainingRooms} phòng cho ngày bạn chọn!`);
          }
        } catch (error) {
          console.error('Error checking availability:', error);
        }
      }
    };
    
    const debouncedCheck = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debouncedCheck);
  }, [form.watch('roomType'), form.watch('checkIn'), form.watch('checkOut')]);

  const onSubmit = async (data: BookingFormData) => {
    if (availabilityStatus.checked && !availabilityStatus.available) {
      toast.error('Phòng đã hết chỗ cho ngày bạn chọn! Vui lòng chọn ngày khác hoặc loại phòng khác.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await createBooking(data);
      
      if (result.success) {
        form.reset();
        setTimeout(() => {
          navigate('/booking-success', { 
            state: { bookingId: result.bookingId, bookingDetails: data } 
          });
        }, 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateInBookedRange = (date: Date): boolean => {
    if (bookedDates.some(bookedDate => 
      isSameDay(date, bookedDate)
    )) {
      return true;
    }
    
    return bookedDateRanges.some(range => 
      (isSameDay(date, range.start) || isAfter(date, range.start)) && 
      (isSameDay(date, range.end) || isBefore(date, range.end))
    );
  };

  const disableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) {
      return true;
    }
    
    if (form.watch('roomType') && isDateInBookedRange(date)) {
      return true;
    }
    
    return false;
  };

  const handleDateRangeSelect = (range: { from: Date, to: Date } | undefined) => {
    if (!range) return;
    
    if (range.from) {
      form.setValue('checkIn', format(range.from, 'yyyy-MM-dd'));
      
      if (range.to) {
        form.setValue('checkOut', format(range.to, 'yyyy-MM-dd'));
        setCalendarOpen(false);
      }
    }
    
    setSelectedDateRange(range);
  };

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(date, 'dd/MM/yyyy');
  };

  // Get formatted check-in and check-out dates
  const checkInDate = form.watch('checkIn');
  const checkOutDate = form.watch('checkOut');
  const formattedCheckIn = formatDisplayDate(checkInDate);
  const formattedCheckOut = formatDisplayDate(checkOutDate);
  
  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = parse(checkInDate, 'yyyy-MM-dd', new Date());
    const end = parse(checkOutDate, 'yyyy-MM-dd', new Date());
    return differenceInDays(end, start);
  }, [checkInDate, checkOutDate]);

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          {language === 'vi' ? 'Đặt phòng' : 'Book a Room'}
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'vi' ? 'Thông tin đặt phòng' : 'Booking Information'}
              </CardTitle>
              <CardDescription>
                {language === 'vi' 
                  ? 'Vui lòng điền đầy đủ thông tin để đặt phòng' 
                  : 'Please fill in all information to book a room'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {availabilityStatus.checked && !availabilityStatus.available && (
                <Alert className="mb-6 bg-red-50 border-red-200">
                  <AlertTitle className="text-red-700">
                    {language === 'vi' ? 'Phòng không khả dụng' : 'Room not available'}
                  </AlertTitle>
                  <AlertDescription className="text-red-600">
                    {language === 'vi' 
                      ? 'Phòng đã hết chỗ cho ngày bạn chọn! Vui lòng chọn ngày khác hoặc loại phòng khác.' 
                      : 'Room is fully booked for your selected dates! Please choose different dates or room type.'
                    }
                  </AlertDescription>
                </Alert>
              )}
              
              {availabilityStatus.checked && availabilityStatus.available && availabilityStatus.remainingRooms <= 2 && (
                <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                  <AlertTitle className="text-yellow-700">
                    {language === 'vi' ? 'Phòng sắp hết' : 'Low availability'}
                  </AlertTitle>
                  <AlertDescription className="text-yellow-600">
                    {language === 'vi' 
                      ? `Chỉ còn ${availabilityStatus.remainingRooms} phòng cho ngày bạn chọn!` 
                      : `Only ${availabilityStatus.remainingRooms} rooms left for your selected dates!`
                    }
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'vi' ? 'Họ và tên' : 'Full name'}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={language === 'vi' ? 'Nhập họ và tên' : 'Enter your full name'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'vi' ? 'Số điện thoại' : 'Phone number'}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={language === 'vi' ? 'Nhập số điện thoại' : 'Enter your phone number'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'vi' ? 'Loại phòng' : 'Room type'}
                          </FormLabel>
                          <Select 
                            disabled={isLoading}
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value !== field.value) {
                                const today = new Date();
                                form.setValue('checkIn', format(today, 'yyyy-MM-dd'));
                                form.setValue('checkOut', format(addDays(today, 1), 'yyyy-MM-dd'));
                                setSelectedDateRange({
                                  from: today,
                                  to: addDays(today, 1)
                                });
                              }
                            }} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={language === 'vi' ? 'Chọn loại phòng' : 'Select room type'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roomTypes.map((room: any) => (
                                <SelectItem key={room.id} value={room.id}>
                                  {language === 'vi' ? room.name : room.name_en}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel>
                        {language === 'vi' ? 'Chọn ngày đặt phòng' : 'Select booking dates'}
                      </FormLabel>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formattedCheckIn && formattedCheckOut ? (
                                <span>
                                  {formattedCheckIn} - {formattedCheckOut} 
                                  <span className="ml-2 text-sm text-gray-500">
                                    ({numberOfNights} {language === 'vi' ? 'đêm' : 'night(s)'})
                                  </span>
                                </span>
                              ) : (
                                <span>{language === 'vi' ? 'Chọn ngày' : 'Select dates'}</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          {selectedRoom ? (
                            <div className="p-2">
                              <h3 className="font-medium text-center mb-2">
                                {language === 'vi' ? 'Chọn ngày đặt phòng' : 'Select booking dates'}
                              </h3>
                              <PricedCalendar
                                roomTypeId={selectedRoom.id}
                                regularPrice={selectedRoom.price}
                                weekendPrice={selectedRoom.weekend_price || selectedRoom.price}
                                mode="range"
                                selected={selectedDateRange}
                                onRangeSelect={handleDateRangeSelect}
                                disabled={disableDates}
                                className="w-full min-w-[300px] sm:min-w-[500px] pointer-events-auto"
                                fromMonth={new Date()}
                                showPrices={true}
                              />
                            </div>
                          ) : (
                            <div className="p-4 text-center">
                              {language === 'vi' 
                                ? 'Vui lòng chọn loại phòng trước' 
                                : 'Please select a room type first'}
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                      {(form.formState.errors.checkIn || form.formState.errors.checkOut) && (
                        <FormMessage>
                          {form.formState.errors.checkIn?.message || form.formState.errors.checkOut?.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="adults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'vi' ? 'Số người lớn' : 'Number of adults'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={10} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="children"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {language === 'vi' ? 'Số trẻ em' : 'Number of children'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={10} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === 'vi' ? 'Yêu cầu đặc biệt' : 'Special requests'}
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={
                              language === 'vi' 
                                ? 'Nhập yêu cầu đặc biệt (nếu có)' 
                                : 'Enter any special requests (optional)'
                            } 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {totalPrice !== null && selectedRoom && (
                    <Alert className="bg-beach-50 border-beach-200">
                      <AlertTitle className="text-beach-800 font-medium">
                        {language === 'vi' ? 'Tổng giá đặt phòng' : 'Total booking price'}
                      </AlertTitle>
                      <AlertDescription className="text-beach-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">
                              {language === 'vi' ? selectedRoom.name : selectedRoom.name_en}
                            </span>
                            <span className="block text-sm">
                              {numberOfNights} {language === 'vi' ? 'đêm' : 'night(s)'} ({formattedCheckIn} - {formattedCheckOut})
                            </span>
                          </div>
                          <div className="text-xl font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <CardFooter className="flex justify-end px-0 pt-6">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto" 
                      disabled={isSubmitting || (availabilityStatus.checked && !availabilityStatus.available)}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {language === 'vi' ? 'Đang xử lý...' : 'Processing...'}
                        </span>
                      ) : (
                        <span>{language === 'vi' ? 'Đặt phòng' : 'Book now'}</span>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingPage;
