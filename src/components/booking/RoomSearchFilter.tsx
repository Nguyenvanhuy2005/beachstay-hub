
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Users } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface RoomSearchFilterProps {
  onSearch: (filters: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
  isLoading: boolean;
}

const RoomSearchFilter: React.FC<RoomSearchFilterProps> = ({ 
  onSearch, 
  isLoading 
}) => {
  const { language } = useLanguage();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState<string>("2");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSearch = () => {
    if (!dateRange?.from || !dateRange?.to) {
      return;
    }

    onSearch({
      checkIn: format(dateRange.from, 'yyyy-MM-dd'),
      checkOut: format(dateRange.to, 'yyyy-MM-dd'),
      guests: parseInt(guests) || 2,
    });
  };

  return (
    <Card className="border-beach-100 shadow-sm bg-white/90 backdrop-blur-sm mb-8">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row overflow-hidden rounded-lg">
          <div className="relative flex-1 flex items-center p-4 border-b md:border-b-0 md:border-r border-beach-100">
            <div className="absolute top-0 left-0 p-1 px-3 text-xs text-beach-600 font-medium">
              {language === 'vi' ? 'Nhận phòng' : 'Check-in'}
            </div>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal h-16 pt-4",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    format(dateRange.from, 'dd/MM/yyyy')
                  ) : (
                    <span>{language === 'vi' ? 'Chọn ngày' : 'Select date'}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="relative flex-1 flex items-center p-4 border-b md:border-b-0 md:border-r border-beach-100">
            <div className="absolute top-0 left-0 p-1 px-3 text-xs text-beach-600 font-medium">
              {language === 'vi' ? 'Trả phòng' : 'Check-out'}
            </div>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal h-16 pt-4",
                    !dateRange?.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.to ? (
                    format(dateRange.to, 'dd/MM/yyyy')
                  ) : (
                    <span>{language === 'vi' ? 'Chọn ngày' : 'Select date'}</span>
                  )}
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>
          
          <div className="relative flex-1 flex items-center p-4 border-b md:border-b-0 md:border-r border-beach-100">
            <div className="absolute top-0 left-0 p-1 px-3 text-xs text-beach-600 font-medium">
              {language === 'vi' ? 'Số khách' : 'Guests'}
            </div>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="w-full border-none h-16 pt-4">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {language === 'vi' ? 'người' : 'guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="m-3 bg-beach-600 hover:bg-beach-700 text-white flex-shrink-0"
            size="lg"
            onClick={handleSearch}
            disabled={!dateRange?.from || !dateRange?.to || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {language === 'vi' ? 'Đang tìm...' : 'Searching...'}
              </div>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Tìm phòng' : 'Search Rooms'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomSearchFilter;
