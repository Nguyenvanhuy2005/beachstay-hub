
import React from 'react';
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Wifi, Tv, Bath, Coffee, Umbrella, Dumbbell, ShowerHead, 
  Refrigerator, CookingPot, Microwave, Utensils, Car, Bed,
  Ban, Plane, LifeBuoy, UtensilsCrossed, FlameKindling
} from "lucide-react";

interface RoomAmenityOption {
  id: string;
  name: string;
  name_en: string;
  icon: React.ReactNode;
}

const amenityOptions: RoomAmenityOption[] = [
  { id: 'wifi', name: 'WiFi miễn phí', name_en: 'Free WiFi', icon: <Wifi className="h-5 w-5 text-beach-600" /> },
  { id: 'tv', name: 'TV màn hình phẳng', name_en: 'Flat-screen TV', icon: <Tv className="h-5 w-5 text-beach-600" /> },
  { id: 'bath', name: 'Bồn tắm', name_en: 'Bathtub', icon: <Bath className="h-5 w-5 text-beach-600" /> },
  { id: 'coffee', name: 'Máy pha cà phê', name_en: 'Coffee maker', icon: <Coffee className="h-5 w-5 text-beach-600" /> },
  { id: 'air_con', name: 'Điều hòa', name_en: 'Air conditioning', icon: <Umbrella className="h-5 w-5 text-beach-600" /> },
  { id: 'minibar', name: 'Minibar', name_en: 'Minibar', icon: <Refrigerator className="h-5 w-5 text-beach-600" /> },
  { id: 'safe', name: 'Két an toàn', name_en: 'Safe', icon: <Refrigerator className="h-5 w-5 text-beach-600" /> },
  { id: 'desk', name: 'Bàn công riêng', name_en: 'Private desk', icon: <Refrigerator className="h-5 w-5 text-beach-600" /> },
  { id: 'room_service', name: 'Dịch vụ phòng 24/7', name_en: '24/7 room service', icon: <Utensils className="h-5 w-5 text-beach-600" /> },
  { id: 'toiletries', name: 'Đồ vệ sinh cá nhân cao cấp', name_en: 'Premium toiletries', icon: <ShowerHead className="h-5 w-5 text-beach-600" /> },
  { id: 'pool', name: 'Hồ bơi trong nhà', name_en: 'Indoor pool', icon: <LifeBuoy className="h-5 w-5 text-beach-600" /> },
  { id: 'parking', name: 'Chỗ đỗ xe miễn phí', name_en: 'Free parking', icon: <Car className="h-5 w-5 text-beach-600" /> },
  { id: 'family_room', name: 'Phòng gia đình', name_en: 'Family room', icon: <Bed className="h-5 w-5 text-beach-600" /> },
  { id: 'airport_shuttle', name: 'Xe đưa đón sân bay', name_en: 'Airport shuttle', icon: <Plane className="h-5 w-5 text-beach-600" /> },
  { id: 'non_smoking', name: 'Phòng không hút thuốc', name_en: 'Non-smoking rooms', icon: <Ban className="h-5 w-5 text-beach-600" /> },
  { id: 'room_service', name: 'Dịch vụ phòng', name_en: 'Room service', icon: <UtensilsCrossed className="h-5 w-5 text-beach-600" /> },
  { id: 'bbq', name: 'Tiện nghi BBQ', name_en: 'BBQ facilities', icon: <FlameKindling className="h-5 w-5 text-beach-600" /> },
  { id: 'private_beach', name: 'Khu vực bãi tắm riêng', name_en: 'Private beach area', icon: <Umbrella className="h-5 w-5 text-beach-600" /> },
];

interface RoomAmenitiesProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

const RoomAmenities: React.FC<RoomAmenitiesProps> = ({ selectedAmenities, onChange }) => {
  const toggleAmenity = (amenityId: string) => {
    if (selectedAmenities.includes(amenityId)) {
      onChange(selectedAmenities.filter(id => id !== amenityId));
    } else {
      onChange([...selectedAmenities, amenityId]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tiện Nghi Phòng</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {amenityOptions.map((amenity) => (
          <div key={amenity.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`amenity-${amenity.id}`}
              checked={selectedAmenities.includes(amenity.id)}
              onCheckedChange={() => toggleAmenity(amenity.id)}
            />
            <div className="flex items-center gap-2">
              {amenity.icon}
              <label 
                htmlFor={`amenity-${amenity.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {amenity.name}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { RoomAmenities, amenityOptions };
