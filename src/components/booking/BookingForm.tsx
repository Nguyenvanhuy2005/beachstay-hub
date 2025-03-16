
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { parse, isAfter, isBefore, format, differenceInDays, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import DateRangePicker from '@/components/booking/DateRangePicker';
import BookingSummary from '@/components/booking/BookingSummary';
import { BookingFormData, createBooking } from '@/api/bookingApi';
import { checkRoomAvailability, getBookedDatesForRoomType, getRoomPriceForDate } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { isDateInBookedRange } from '@/lib/dateUtils';

// Create form schema
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
  if (!data.checkIn || !data.checkOut) return true;
  
  const checkIn = parse(data.checkIn, 'yyyy-MM-dd', new Date());
  const checkOut = parse(data.checkOut, 'yyyy-MM-dd', new Date());
  return isAfter(checkOut, checkIn);
}, {
  message: "Ngày trả phòng phải sau ngày nhận phòng",
  path: ["checkOut"],
});

interface BookingFormProps {
  roomTypes: any[];
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ roomTypes, isLoading }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [bookedDateRanges, setBookedDateRanges] = useState<{start: Date, end: Date}[]>([]);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState({ 
    checked: false, 
    available: true, 
    remainingRooms: 0 
  });

  const form = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      roomType: '',
      adults: 2,
      children: 0,
      specialRequests: '',
    },
  });

  // Watch for room type changes
  useEffect(() => {
    const roomType = form.watch('roomType');
    if (roomType) {
      const room = roomTypes.find((r: any) => r.id === roomType);
      setSelectedRoom(room || null);
    } else {
      setSelectedRoom(null);
    }
  }, [form.watch('roomType'), roomTypes]);

  // Fetch booked dates when room type changes
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

  // Calculate total price
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
        
        const nights = differenceInDays(checkOutDate, checkInDate);
        
        if (nights <= 0) {
          setTotalPrice(null);
          return;
        }
        
        const dates = eachDayOfInterval({ 
          start: checkInDate, 
          end: new Date(checkOutDate.getTime() - 1) 
        });
        
        let sum = 0;
        
        for (const date of dates) {
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

  // Check availability
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

  const disableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) {
      return true;
    }
    
    if (form.watch('roomType') && isDateInBookedRange(date, bookedDates, bookedDateRanges)) {
      return true;
    }
    
    return false;
  };

  const handleDateRangeChange = (dateRange: { checkIn: string; checkOut: string }) => {
    form.setValue('checkIn', dateRange.checkIn);
    form.setValue('checkOut', dateRange.checkOut);
  };

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BookingSummary 
          selectedRoom={selectedRoom}
          checkIn={form.watch('checkIn')}
          checkOut={form.watch('checkOut')}
          totalPrice={totalPrice}
          availabilityStatus={availabilityStatus}
        />

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
                      form.setValue('checkIn', '');
                      form.setValue('checkOut', '');
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
            <DateRangePicker
              checkIn={form.watch('checkIn')}
              checkOut={form.watch('checkOut')}
              roomTypeId={form.watch('roomType')}
              selectedRoom={selectedRoom}
              onDateRangeChange={handleDateRangeChange}
              disabledDates={disableDates}
            />
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
        
        <div className="flex justify-end pt-6">
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
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
