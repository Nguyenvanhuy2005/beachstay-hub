import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
interface QuickBookingFormProps {
  onFullBooking?: () => void;
}
const QuickBookingForm: React.FC<QuickBookingFormProps> = ({
  onFullBooking
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roomType, setRoomType] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const {
    language
  } = useLanguage();
  const isVietnamese = language === 'vi';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !roomType || !date) {
      toast.error(isVietnamese ? 'Vui lòng điền đầy đủ thông tin đặt phòng!' : 'Please fill in all booking information!');
      return;
    }
    toast.success(isVietnamese ? 'Yêu cầu đặt phòng đã được gửi thành công!' : 'Booking request has been sent successfully!');

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setRoomType('');
    setDate(undefined);
  };
  return <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {isVietnamese ? 'Đặt Phòng Nhanh' : 'Quick Booking'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-700">
            {isVietnamese ? 'Họ và tên' : 'Full Name'}
          </Label>
          <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder={isVietnamese ? 'Nhập họ và tên' : 'Enter your full name'} className="mt-1" />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={isVietnamese ? 'Nhập địa chỉ email' : 'Enter your email address'} className="mt-1" />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-gray-700">
            {isVietnamese ? 'Số điện thoại' : 'Phone Number'}
          </Label>
          <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={isVietnamese ? 'Nhập số điện thoại' : 'Enter your phone number'} className="mt-1" />
        </div>
        
        <div>
          <Label htmlFor="roomType" className="text-gray-700">
            {isVietnamese ? 'Loại phòng' : 'Room Type'}
          </Label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger id="roomType" className="mt-1">
              <SelectValue placeholder={isVietnamese ? 'Chọn loại phòng' : 'Select room type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                {isVietnamese ? 'Phòng Tiêu Chuẩn' : 'Standard Room'}
              </SelectItem>
              <SelectItem value="deluxe">
                {isVietnamese ? 'Phòng Deluxe' : 'Deluxe Room'}
              </SelectItem>
              <SelectItem value="suite">
                {isVietnamese ? 'Phòng Suite' : 'Suite Room'}
              </SelectItem>
              <SelectItem value="villa">
                {isVietnamese ? 'Biệt Thự' : 'Villa'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date" className="text-gray-700">
            {isVietnamese ? 'Chọn ngày ở' : 'Select Stay Date'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 text-zinc-950">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PP') : <span className="text-zinc-950">
                    {isVietnamese ? 'Chọn ngày nhận và trả phòng' : 'Select check-in and check-out dates'}
                  </span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button type="submit" className="w-full bg-beach-600 hover:bg-beach-700 py-6 bg-[gree-900] hover:bg-[[gree-800] bg-green-900 hover:bg-green-800">
          {isVietnamese ? 'Gửi Yêu Cầu' : 'Submit Request'}
        </Button>
      </form>
      
      {onFullBooking && <div className="mt-4 text-center">
          <button onClick={onFullBooking} className="text-beach-700 hover:text-beach-800 underline text-sm">
            {isVietnamese ? 'Đặt phòng chi tiết hơn' : 'Make a more detailed booking'}
          </button>
        </div>}
    </div>;
};
export default QuickBookingForm;