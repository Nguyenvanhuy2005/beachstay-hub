
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { format, parse, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PricedCalendar from "@/components/booking/PricedCalendar";
import { createBooking, getRoomTypes } from "@/api/bookingApi";
import { checkRoomAvailability, getBookedDatesForRoomType } from "@/lib/supabase";
import { eachDayOfInterval, isSameDay, isBefore } from "date-fns";

interface QuickBookingFormProps {
  onFullBooking: () => void;
}

const QuickBookingForm: React.FC<QuickBookingFormProps> = ({ onFullBooking }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  
  useEffect(() => {
    loadRoomTypes();
  }, []);
  
  const loadRoomTypes = async () => {
    const data = await getRoomTypes();
    setRoomTypes(data);
  };
  
  useEffect(() => {
    if (errorMessage) setErrorMessage('');
  }, [checkIn, checkOut, roomType]);
  
  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!roomType) return;

      try {
        const bookedDateRanges = await getBookedDatesForRoomType(roomType);
        
        const allBookedDates: Date[] = [];
        
        bookedDateRanges.forEach(booking => {
          const startDate = new Date(booking.check_in);
          const endDate = new Date(booking.check_out);
          
          const datesInRange = eachDayOfInterval({ start: startDate, end: endDate });
          allBookedDates.push(...datesInRange);
        });
        
        setBookedDates(allBookedDates);
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };
    
    fetchBookedDates();
  }, [roomType]);
  
  const isDateBooked = (date: string) => {
    if (!bookedDates.length || !date) return false;
    
    const selectedDate = new Date(date);
    return bookedDates.some(bookedDate => 
      isSameDay(selectedDate, bookedDate)
    );
  };
  
  const handleQuickBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !checkIn || !checkOut || !roomType) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    if (isDateBooked(checkIn) || isDateBooked(checkOut)) {
      setErrorMessage('Ngày bạn chọn đã có khách đặt! Vui lòng chọn ngày khác.');
      toast.error('Ngày bạn chọn đã có khách đặt! Vui lòng chọn ngày khác.');
      return;
    }
    
    setChecking(true);
    
    try {
      const availabilityResult = await checkRoomAvailability(roomType, checkIn, checkOut);
      
      if (!availabilityResult.available) {
        setErrorMessage('Phòng đã hết chỗ cho ngày bạn chọn! Vui lòng chọn ngày khác hoặc loại phòng khác.');
        toast.error('Phòng đã hết chỗ cho ngày bạn chọn! Vui lòng chọn ngày khác hoặc loại phòng khác.');
        setChecking(false);
        return;
      }
      
      setLoading(true);
      setChecking(false);
      
      const bookingData = {
        fullName,
        email,
        phone,
        checkIn,
        checkOut,
        roomType,
        adults: 2,
        children: 0
      };
      
      const result = await createBooking(bookingData);
      
      if (result.success) {
        toast.success('Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        setFullName('');
        setEmail('');
        setPhone('');
        setCheckIn('');
        setCheckOut('');
        setRoomType('');
        setSelectedDateRange(undefined);
      }
    } catch (error) {
      console.error('Error during quick booking:', error);
      toast.error('Đã xảy ra lỗi khi đặt phòng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const disableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) {
      return true;
    }
    
    if (roomType && bookedDates.some(bookedDate => isSameDay(date, bookedDate))) {
      return true;
    }
    
    return false;
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    
    if (range?.from) {
      setCheckIn(format(range.from, 'yyyy-MM-dd'));
      
      if (range.to) {
        setCheckOut(format(range.to, 'yyyy-MM-dd'));
        setCalendarOpen(false);
      }
    } else {
      setCheckIn('');
      setCheckOut('');
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(date, 'dd/MM/yyyy');
  };

  const formattedCheckIn = formatDisplayDate(checkIn);
  const formattedCheckOut = formatDisplayDate(checkOut);
  
  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = parse(checkIn, 'yyyy-MM-dd', new Date());
    const end = parse(checkOut, 'yyyy-MM-dd', new Date());
    return differenceInDays(end, start);
  }, [checkIn, checkOut]);

  const selectedRoom = useMemo(() => {
    if (!roomType) return null;
    return roomTypes.find(room => room.id === roomType);
  }, [roomType, roomTypes]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h3 className="font-serif text-beach-700 text-2xl font-bold mb-6">
        Đặt Phòng Nhanh
      </h3>
      <form className="space-y-4" onSubmit={handleQuickBooking}>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Họ và tên</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
            placeholder="Nhập họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
          <input 
            type="email" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
            placeholder="Nhập địa chỉ email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Số điện thoại</label>
          <input 
            type="tel" 
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Loại phòng</label>
          <select 
            className={`w-full px-4 py-3 border rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900 ${errorMessage ? 'border-red-500' : 'border-gray-300'}`}
            value={roomType}
            onChange={(e) => {
              setRoomType(e.target.value);
              if (e.target.value !== roomType) {
                setCheckIn('');
                setCheckOut('');
                setSelectedDateRange(undefined);
              }
            }}
            required
          >
            <option value="">Chọn loại phòng</option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errorMessage && (
            <p className="mt-1 text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 mb-1 text-sm font-medium">Chọn ngày ở</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center px-4 py-3 border border-gray-300 rounded-md focus:ring-beach-500 focus:border-beach-500 text-gray-900 bg-white"
              >
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                {formattedCheckIn && formattedCheckOut ? (
                  <span>
                    {formattedCheckIn} - {formattedCheckOut} 
                    <span className="ml-2 text-sm text-gray-500">
                      ({numberOfNights} đêm)
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-500">Chọn ngày nhận và trả phòng</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 max-w-none" align="start">
              {roomType ? (
                <div className="p-3">
                  <h3 className="font-medium text-center mb-3">Chọn ngày đặt phòng</h3>
                  <PricedCalendar
                    roomTypeId={roomType}
                    regularPrice={selectedRoom?.price || 0}
                    weekendPrice={selectedRoom?.weekend_price || selectedRoom?.price || 0}
                    mode="range"
                    selected={selectedDateRange}
                    onRangeSelect={handleDateRangeSelect}
                    disabled={disableDates}
                    className="w-full min-w-[340px] sm:min-w-[600px] pointer-events-auto"
                    fromMonth={new Date()}
                    showPrices={false}
                  />
                </div>
              ) : (
                <div className="p-4 text-center text-gray-700">
                  Vui lòng chọn loại phòng trước
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <Button 
          className="w-full bg-beach-600 hover:bg-beach-700 text-white py-3"
          type="submit"
          disabled={loading || checking || !checkIn || !checkOut || isDateBooked(checkIn) || isDateBooked(checkOut)}
        >
          {loading ? "Đang xử lý..." : checking ? "Đang kiểm tra..." : "Gửi Yêu Cầu"}
        </Button>
      </form>
    </div>
  );
};

export default QuickBookingForm;
