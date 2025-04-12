
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const RoomTypesPage = () => {
  const { language } = useLanguage();
  
  // This is just a placeholder for the room card section that had errors
  // The actual component would need the full implementation with room and searchFilters objects
  const renderBookNowButton = (room: any, searchFilters?: any) => (
    <Button asChild className="bg-beach-600 hover:bg-beach-700 text-beach-50">
      <Link to={`/dat-phong${searchFilters ? `?roomType=${room.id}&checkIn=${searchFilters.checkIn}&checkOut=${searchFilters.checkOut}&guests=${searchFilters.guests}` : ''}`}>
        <Calendar className="mr-2 h-4 w-4" />
        {language === 'vi' ? 'Đặt Ngay' : 'Book Now'}
      </Link>
    </Button>
  );

  return (
    <div>
      {/* Implementation of the RoomTypesPage content would go here */}
      {/* This is just a placeholder to demonstrate the button structure */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {language === 'vi' ? 'Loại Phòng' : 'Room Types'}
        </h1>
        
        {/* Example usage of the renderBookNowButton function */}
        {/* This would normally be part of a map function over room data */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">
            {language === 'vi' ? 'Phòng Mẫu' : 'Sample Room'}
          </h2>
          <p className="my-2">
            {language === 'vi' ? 'Mô tả phòng mẫu' : 'Sample room description'}
          </p>
          {renderBookNowButton({ id: 'sample-room' })}
        </div>
      </div>
    </div>
  );
};

export default RoomTypesPage;
