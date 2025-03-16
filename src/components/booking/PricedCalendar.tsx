
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, isWeekend } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { DayContentProps } from 'react-day-picker';

interface PricedCalendarProps {
  roomTypeId: string;
  regularPrice: number;
  weekendPrice: number;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  mode?: "single" | "range" | "multiple";
  fromMonth?: Date;
  toMonth?: Date;
  showPrices?: boolean;
}

interface CustomPrice {
  date: string;
  price: number;
}

const PricedCalendar: React.FC<PricedCalendarProps> = ({
  roomTypeId,
  regularPrice,
  weekendPrice,
  selected,
  onSelect,
  disabled,
  className,
  mode = "single",
  fromMonth,
  toMonth,
  showPrices = false
}) => {
  const [customPrices, setCustomPrices] = useState<CustomPrice[]>([]);
  
  // Fetch custom prices for this room
  useEffect(() => {
    if (!roomTypeId) return;
    
    const fetchCustomPrices = async () => {
      try {
        const { data, error } = await supabase
          .from('room_date_prices')
          .select('date, price')
          .eq('room_type_id', roomTypeId);
          
        if (error) throw error;
        
        setCustomPrices(data || []);
      } catch (error) {
        console.error('Error fetching custom prices:', error);
      }
    };
    
    fetchCustomPrices();
  }, [roomTypeId]);
  
  // Get the price for a specific date
  const getPriceForDate = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const customPrice = customPrices.find(item => item.date === dateStr);
    
    if (customPrice) {
      return customPrice.price;
    }
    
    return isWeekend(date) ? weekendPrice : regularPrice;
  };
  
  // Format price for display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Custom render for each day in the calendar
  const renderDay = (props: DayContentProps) => {
    const { date } = props;
    const price = getPriceForDate(date);
    const formattedPrice = formatPrice(price);
    const isCustomPrice = customPrices.some(item => item.date === format(date, 'yyyy-MM-dd'));
    const isSelectedDate = selected && isSameDay(date, selected);
    
    return (
      <div className={`flex flex-col items-center ${isSelectedDate ? 'text-white' : ''}`}>
        <div>{date.getDate()}</div>
        {showPrices && (
          <div className={`text-[9px] mt-1 ${isCustomPrice ? 'font-bold' : ''} ${isSelectedDate ? 'text-white' : 'text-gray-600'}`}>
            {formattedPrice}
          </div>
        )}
      </div>
    );
  };
  
  // We need to render the calendar with the correct props based on the mode
  if (mode === "single") {
    return (
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        components={{
          Day: renderDay
        }}
        className={className}
        fromMonth={fromMonth}
        toMonth={toMonth}
      />
    );
  } else if (mode === "range") {
    // Handle range mode if needed
    return (
      <Calendar
        mode="range"
        selected={{
          from: selected,
          to: selected
        }}
        onSelect={(range) => {
          if (onSelect && range?.from) {
            onSelect(range.from);
          }
        }}
        disabled={disabled}
        components={{
          Day: renderDay
        }}
        className={className}
        fromMonth={fromMonth}
        toMonth={toMonth}
      />
    );
  } else {
    // Handle multiple mode if needed
    return (
      <Calendar
        mode="multiple"
        selected={selected ? [selected] : []}
        onSelect={(dates) => {
          if (onSelect && dates && dates.length > 0) {
            onSelect(dates[dates.length - 1]);
          } else if (onSelect) {
            onSelect(undefined);
          }
        }}
        disabled={disabled}
        components={{
          Day: renderDay
        }}
        className={className}
        fromMonth={fromMonth}
        toMonth={toMonth}
      />
    );
  }
};

export default PricedCalendar;
