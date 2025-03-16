
import React from 'react';
import { format, parse, differenceInDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingSummaryProps {
  selectedRoom: any;
  checkIn: string;
  checkOut: string;
  totalPrice: number | null;
  availabilityStatus: {
    checked: boolean;
    available: boolean;
    remainingRooms: number;
  };
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ 
  selectedRoom, 
  checkIn, 
  checkOut, 
  totalPrice, 
  availabilityStatus 
}) => {
  const { language } = useLanguage();

  if (!selectedRoom || !checkIn || !checkOut) {
    return null;
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(date, 'dd/MM/yyyy');
  };

  const numberOfNights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = parse(checkIn, 'yyyy-MM-dd', new Date());
    const end = parse(checkOut, 'yyyy-MM-dd', new Date());
    return differenceInDays(end, start);
  }, [checkIn, checkOut]);

  return (
    <>
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

      {totalPrice !== null && (
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
                  {numberOfNights} {language === 'vi' ? 'đêm' : 'night(s)'} ({formatDisplayDate(checkIn)} - {formatDisplayDate(checkOut)})
                </span>
              </div>
              <div className="text-xl font-bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default BookingSummary;
