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
  const [guestCount, setGuestCount] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const {
    language
  } = useLanguage();
  const isVietnamese = language === 'vi';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields (name, phone, guest count, date)
    if (!name || !phone || !guestCount || !date) {
      toast.error(isVietnamese ? 'Vui lòng điền đầy đủ thông tin bắt buộc: Họ và tên, Số điện thoại, Số lượng người đi và Ngày nhận phòng!' : 'Please fill in all required information: Name, Phone Number, Number of Guests and Check-in Date!');
      return;
    }
    
    toast.success(isVietnamese ? 'Yêu cầu tư vấn phòng nghỉ dưỡng đã được gửi thành công!' : 'Resort room consultation request has been sent successfully!');

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setGuestCount('');
    setDate(undefined);
  };
  return <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-xl p-6 md:p-8 text-white">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">
          {isVietnamese ? 'Đặt Phòng Ngay Hôm Nay' : 'Book Today'}
        </h3>
        <h4 className="text-xl font-semibold mb-3">
          {isVietnamese ? 'Và Nhận Ưu Đãi Đặc Biệt' : 'And Receive Special Offers'}
        </h4>
        <p className="text-green-100 text-sm">
          {isVietnamese ? 'Đặt phòng trực tiếp trên website chính thức của chúng tôi để nhận được giá tốt nhất cùng nhiều ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đặt phòng online.' : 'Book directly on our official website to get the best prices with many attractive offers exclusively for online booking customers.'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white font-medium">
            {isVietnamese ? 'Họ và tên' : 'Full Name'} <span className="text-red-300">*</span>
          </Label>
          <Input 
            id="name" 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder={isVietnamese ? 'Nhập họ và tên' : 'Enter your full name'} 
            className="mt-1 bg-white/90 border-green-300 focus:border-green-500" 
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-white font-medium">
            Email
          </Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder={isVietnamese ? 'Nhập địa chỉ email' : 'Enter your email address'} 
            className="mt-1 bg-white/90 border-green-300 focus:border-green-500" 
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-white font-medium">
            {isVietnamese ? 'Số điện thoại' : 'Phone Number'} <span className="text-red-300">*</span>
          </Label>
          <Input 
            id="phone" 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder={isVietnamese ? 'Nhập số điện thoại' : 'Enter your phone number'} 
            className="mt-1 bg-white/90 border-green-300 focus:border-green-500" 
            required
          />
        </div>
        
        <div>
          <Label htmlFor="guestCount" className="text-white font-medium">
            {isVietnamese ? 'Số lượng người đi' : 'Number of Guests'} <span className="text-red-300">*</span>
          </Label>
          <Select value={guestCount} onValueChange={setGuestCount}>
            <SelectTrigger id="guestCount" className="mt-1 bg-white/90 border-green-300">
              <SelectValue placeholder={isVietnamese ? 'Chọn số lượng người đi' : 'Select number of guests'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1-2 {isVietnamese ? 'người' : 'guests'}</SelectItem>
              <SelectItem value="3-4">3-4 {isVietnamese ? 'người' : 'guests'}</SelectItem>
              <SelectItem value="5-6">5-6 {isVietnamese ? 'người' : 'guests'}</SelectItem>
              <SelectItem value="7-8">7-8 {isVietnamese ? 'người' : 'guests'}</SelectItem>
              <SelectItem value="9+">9+ {isVietnamese ? 'người' : 'guests'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date" className="text-white font-medium">
            {isVietnamese ? 'Chọn ngày muốn nhận phòng' : 'Choose desired check-in date'} <span className="text-red-300">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 bg-white/90 border-green-300 text-gray-700 hover:bg-white">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PP') : <span className="text-gray-500">
                    {isVietnamese ? 'Chọn ngày muốn nhận phòng' : 'Choose desired check-in date'}
                  </span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button type="submit" className="w-full bg-white text-green-700 hover:bg-green-50 py-6 font-bold text-lg border-2 border-white">
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