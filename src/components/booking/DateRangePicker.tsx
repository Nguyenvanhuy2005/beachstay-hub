
import React, { useState } from 'react';
import { format, parse, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import PricedCalendar from '@/components/booking/PricedCalendar';
import { DateRange } from 'react-day-picker';
import { useLanguage } from '@/contexts/LanguageContext';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  roomTypeId: string | null;
  selectedRoom: any;
  onDateRangeChange: (dateRange: { checkIn: string; checkOut: string }) => void;
  disabledDates?: (date: Date) => boolean;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  roomTypeId,
  selectedRoom,
  onDateRangeChange,
  disabledDates,
  className
}) => {
  const { language } = useLanguage();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(
    checkIn && checkOut
      ? {
          from: parse(checkIn, 'yyyy-MM-dd', new Date()),
          to: parse(checkOut, 'yyyy-MM-dd', new Date())
        }
      : undefined
  );

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) return;
    
    setSelectedDateRange(range);
    
    if (range.from) {
      const checkInDate = format(range.from, 'yyyy-MM-dd');
      
      if (range.to) {
        const checkOutDate = format(range.to, 'yyyy-MM-dd');
        onDateRangeChange({ checkIn: checkInDate, checkOut: checkOutDate });
        setCalendarOpen(false);
      } else {
        onDateRangeChange({ checkIn: checkInDate, checkOut: '' });
      }
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(date, 'dd/MM/yyyy');
  };

  const formattedCheckIn = formatDisplayDate(checkIn);
  const formattedCheckOut = formatDisplayDate(checkOut);
  
  const numberOfNights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = parse(checkIn, 'yyyy-MM-dd', new Date());
    const end = parse(checkOut, 'yyyy-MM-dd', new Date());
    return differenceInDays(end, start);
  }, [checkIn, checkOut]);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-start text-left font-normal ${className}`}
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
      <PopoverContent className="w-auto p-0 mx-auto" align="center">
        {roomTypeId && selectedRoom ? (
          <div className="p-2">
            <h3 className="font-medium text-center mb-2">
              {language === 'vi' ? 'Chọn ngày đặt phòng' : 'Select booking dates'}
            </h3>
            <PricedCalendar
              roomTypeId={roomTypeId}
              regularPrice={selectedRoom.price}
              weekendPrice={selectedRoom.weekend_price || selectedRoom.price}
              mode="range"
              selected={selectedDateRange}
              onRangeSelect={handleDateRangeSelect}
              disabled={disabledDates}
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
  );
};

export default DateRangePicker;
