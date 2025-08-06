import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { createConsultationRequest } from '@/api/consultationApi';
interface ConsultationFormProps {
  onFullBooking?: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onFullBooking
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !consultationType) {
      toast.error(isVietnamese ? 'Vui lòng điền đầy đủ thông tin!' : 'Please fill in all required information!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createConsultationRequest({
        fullName: name,
        email: email,
        phone: phone,
        consultationType: consultationType,
        preferredDate: date,
        message: message
      });

      if (result.success) {
        toast.success(isVietnamese ? 'Yêu cầu tư vấn đã được gửi thành công!' : 'Consultation request has been sent successfully!');
        
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setConsultationType('');
        setDate(undefined);
        setMessage('');
      } else {
        throw new Error(result.error?.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast.error(isVietnamese ? 'Có lỗi xảy ra khi gửi yêu cầu!' : 'An error occurred while submitting your request!');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {isVietnamese ? 'Liên Hệ Tư Vấn' : 'Consultation Request'}
      </h3>
      <p className="text-gray-600 mb-6 text-sm">
        {isVietnamese 
          ? 'Để lại thông tin để nhận được tư vấn miễn phí từ đội ngũ chuyên viên của chúng tôi' 
          : 'Leave your information to receive free consultation from our expert team'
        }
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-700">
            {isVietnamese ? 'Họ và tên *' : 'Full Name *'}
          </Label>
          <Input 
            id="name" 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder={isVietnamese ? 'Nhập họ và tên' : 'Enter your full name'} 
            className="mt-1"
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-gray-700">
            {isVietnamese ? 'Email *' : 'Email *'}
          </Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder={isVietnamese ? 'Nhập địa chỉ email' : 'Enter your email address'} 
            className="mt-1"
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-gray-700">
            {isVietnamese ? 'Số điện thoại *' : 'Phone Number *'}
          </Label>
          <Input 
            id="phone" 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder={isVietnamese ? 'Nhập số điện thoại' : 'Enter your phone number'} 
            className="mt-1"
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="consultationType" className="text-gray-700">
            {isVietnamese ? 'Loại tư vấn *' : 'Consultation Type *'}
          </Label>
          <Select value={consultationType} onValueChange={setConsultationType}>
            <SelectTrigger id="consultationType" className="mt-1">
              <SelectValue placeholder={isVietnamese ? 'Chọn loại tư vấn' : 'Select consultation type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accommodation">
                {isVietnamese ? 'Tư vấn lưu trú' : 'Accommodation Consultation'}
              </SelectItem>
              <SelectItem value="tourism">
                {isVietnamese ? 'Tư vấn du lịch' : 'Tourism Consultation'}
              </SelectItem>
              <SelectItem value="events">
                {isVietnamese ? 'Tư vấn sự kiện' : 'Event Consultation'}
              </SelectItem>
              <SelectItem value="other">
                {isVietnamese ? 'Tư vấn khác' : 'Other Consultation'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date" className="text-gray-700">
            {isVietnamese ? 'Ngày mong muốn được tư vấn' : 'Preferred consultation date'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 text-zinc-950">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PP') : (
                  <span className="text-zinc-950">
                    {isVietnamese ? 'Chọn ngày tư vấn' : 'Select consultation date'}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="message" className="text-gray-700">
            {isVietnamese ? 'Tin nhắn (tùy chọn)' : 'Message (optional)'}
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={isVietnamese ? 'Mô tả chi tiết yêu cầu tư vấn của bạn...' : 'Describe your consultation needs in detail...'}
            className="mt-1"
            rows={3}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6 bg-green-600 hover:bg-green-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (isVietnamese ? 'Đang gửi...' : 'Sending...') 
            : (isVietnamese ? 'Gửi Yêu Cầu Tư Vấn' : 'Send Consultation Request')
          }
        </Button>
      </form>
    </div>
  );
};
export default ConsultationForm;