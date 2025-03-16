import { isSameDay, isAfter, isBefore, eachDayOfInterval, format, addDays, parse } from 'date-fns';

export const isDateInBookedRange = (
  date: Date, 
  bookedDates: Date[] = [], 
  bookedDateRanges: {start: Date, end: Date}[] = []
): boolean => {
  // Check if the date is in the booked dates list
  if (bookedDates.some(bookedDate => isSameDay(date, bookedDate))) {
    return true;
  }
  
  // Check if the date is within any booked range
  return bookedDateRanges.some(range => 
    (isSameDay(date, range.start) || isAfter(date, range.start)) && 
    (isSameDay(date, range.end) || isBefore(date, range.end))
  );
};

export const formatDateForDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  try {
    return eachDayOfInterval({ start: startDate, end: endDate });
  } catch (error) {
    console.error('Error getting dates between:', error);
    return [];
  }
};

// Format price to display in millions (M) format
export const formatPriceInMillions = (price: number): string => {
  if (!price) return '0M';
  const inMillions = price / 1000000;
  return `${inMillions.toFixed(1)}M`;
};

// Get tomorrow's date
export const getTomorrow = (): Date => {
  return addDays(new Date(), 1);
};

// Get date after tomorrow
export const getDayAfterTomorrow = (): Date => {
  return addDays(new Date(), 2);
};

// Parse a date string in any common format to a Date object
export const parseAnyDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  try {
    // Try parsing as ISO format first
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // If that fails, try other common formats
    const formats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'];
    for (const formatStr of formats) {
      try {
        return parse(dateStr, formatStr, new Date());
      } catch (e) {
        // Continue to next format
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};
