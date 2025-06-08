
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format, isSameDay } from 'date-fns';
import { CalendarIcon, Trash2, Save, Loader2 } from 'lucide-react';

interface DatePriceManagementProps {
  roomId: string;
  regularPrice: number;
  weekendPrice: number;
}

interface CustomPrice {
  id: string;
  date: string;
  price: number;
}

const DatePriceManagement: React.FC<DatePriceManagementProps> = ({ 
  roomId, 
  regularPrice, 
  weekendPrice 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customPrices, setCustomPrices] = useState<CustomPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    
    const fetchCustomPrices = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching custom prices for room:', roomId);
        
        const { data, error } = await supabase
          .from('room_date_prices')
          .select('*')
          .eq('room_type_id', roomId);
          
        if (error) {
          console.error('Error fetching custom prices:', error);
          toast.error(`Không thể tải giá tùy chỉnh: ${error.message}`);
          return;
        }
        
        console.log('Fetched custom prices:', data);
        setCustomPrices(data || []);
      } catch (error) {
        console.error('Unexpected error fetching custom prices:', error);
        toast.error('Lỗi không mong đợi khi tải giá tùy chỉnh');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomPrices();
  }, [roomId]);

  useEffect(() => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingCustomPrice = customPrices.find(
      item => item.date === dateStr
    );
    
    if (existingCustomPrice) {
      setCustomPrice(existingCustomPrice.price.toString());
    } else {
      const isSaturday = selectedDate.getDay() === 6;
      const defaultPrice = isSaturday ? weekendPrice : regularPrice;
      setCustomPrice(defaultPrice.toString());
    }
  }, [selectedDate, customPrices, regularPrice, weekendPrice]);

  const validateInput = () => {
    if (!selectedDate) {
      toast.error('Vui lòng chọn ngày');
      return false;
    }
    
    if (!customPrice || customPrice.trim() === '') {
      toast.error('Vui lòng nhập giá');
      return false;
    }
    
    const priceValue = parseFloat(customPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('Giá phải là số dương lớn hơn 0');
      return false;
    }
    
    if (!roomId) {
      toast.error('Không có thông tin loại phòng');
      return false;
    }
    
    return true;
  };

  const saveCustomPrice = async () => {
    if (!validateInput()) return;
    
    setIsSaving(true);
    try {
      const dateStr = format(selectedDate!, 'yyyy-MM-dd');
      const priceValue = parseFloat(customPrice);
      
      console.log('Saving custom price:', {
        room_type_id: roomId,
        date: dateStr,
        price: priceValue
      });
      
      const existingCustomPrice = customPrices.find(
        item => item.date === dateStr
      );
      
      if (existingCustomPrice) {
        console.log('Updating existing custom price:', existingCustomPrice.id);
        
        const { data, error } = await supabase
          .from('room_date_prices')
          .update({ price: priceValue })
          .eq('id', existingCustomPrice.id)
          .select('*')
          .single();
          
        if (error) {
          console.error('Error updating custom price:', error);
          toast.error(`Không thể cập nhật giá: ${error.message}`);
          return;
        }
        
        console.log('Successfully updated custom price:', data);
        
        setCustomPrices(prev => 
          prev.map(item => 
            item.id === existingCustomPrice.id 
              ? { ...item, price: priceValue } 
              : item
          )
        );
        
        toast.success('Đã cập nhật giá tùy chỉnh');
      } else {
        console.log('Creating new custom price');
        
        const { data, error } = await supabase
          .from('room_date_prices')
          .insert({
            room_type_id: roomId,
            date: dateStr,
            price: priceValue
          })
          .select('*')
          .single();
          
        if (error) {
          console.error('Error creating custom price:', error);
          toast.error(`Không thể tạo giá tùy chỉnh: ${error.message}`);
          return;
        }
        
        console.log('Successfully created custom price:', data);
        
        setCustomPrices(prev => [...prev, data]);
        
        toast.success('Đã thêm giá tùy chỉnh');
      }
    } catch (error) {
      console.error('Unexpected error saving custom price:', error);
      toast.error('Lỗi không mong đợi khi lưu giá tùy chỉnh');
    } finally {
      setIsSaving(false);
    }
  };

  const removeCustomPrice = async () => {
    if (!selectedDate || !roomId) {
      toast.error('Không có đủ thông tin để xóa giá tùy chỉnh');
      return;
    }
    
    setIsSaving(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      const existingCustomPrice = customPrices.find(
        item => item.date === dateStr
      );
      
      if (existingCustomPrice) {
        console.log('Removing custom price:', existingCustomPrice.id);
        
        const { error } = await supabase
          .from('room_date_prices')
          .delete()
          .eq('id', existingCustomPrice.id);
          
        if (error) {
          console.error('Error removing custom price:', error);
          toast.error(`Không thể xóa giá tùy chỉnh: ${error.message}`);
          return;
        }
        
        console.log('Successfully removed custom price');
        
        setCustomPrices(prev => 
          prev.filter(item => item.id !== existingCustomPrice.id)
        );
        
        const isSaturday = selectedDate.getDay() === 6;
        const defaultPrice = isSaturday ? weekendPrice : regularPrice;
        setCustomPrice(defaultPrice.toString());
        
        toast.success('Đã xóa giá tùy chỉnh');
      } else {
        toast.info('Không có giá tùy chỉnh để xóa');
      }
    } catch (error) {
      console.error('Unexpected error removing custom price:', error);
      toast.error('Lỗi không mong đợi khi xóa giá tùy chỉnh');
    } finally {
      setIsSaving(false);
    }
  };

  const hasCustomPrice = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return customPrices.some(item => item.date === dateStr);
  };

  const formatPriceInMillions = (price: number): string => {
    const inMillions = price / 1000000;
    return `${inMillions.toFixed(1)}M`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quản lý giá theo ngày</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-beach-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý giá theo ngày</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border max-w-full"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="selected-date">Ngày đã chọn</Label>
              <div id="selected-date" className="text-lg font-medium mt-1">
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chưa chọn ngày'}
              </div>
            </div>
            
            <div>
              <Label htmlFor="current-price-type">Loại giá</Label>
              <div id="current-price-type" className="text-base mt-1">
                {!selectedDate ? (
                  'Chưa chọn ngày'
                ) : hasCustomPrice(selectedDate) ? (
                  <span className="text-blue-600 font-medium">Giá tùy chỉnh</span>
                ) : selectedDate.getDay() === 6 ? (
                  <span className="text-orange-600">Giá cuối tuần (Thứ 7)</span>
                ) : (
                  <span className="text-gray-600">Giá ngày thường</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-price">Giá tùy chỉnh (VND)</Label>
              <Input
                id="custom-price"
                type="number"
                min="0"
                step="10000"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full"
                placeholder="Nhập giá..."
              />
              <p className="text-sm text-muted-foreground">
                Giá mặc định: {selectedDate && selectedDate.getDay() === 6
                  ? `${formatPriceInMillions(weekendPrice)} (cuối tuần - Thứ 7)` 
                  : `${formatPriceInMillions(regularPrice)} (ngày thường)`}
              </p>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button 
                variant="default" 
                onClick={saveCustomPrice} 
                disabled={isSaving || !selectedDate}
                className="flex-1"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? 'Đang lưu...' : 'Lưu giá'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={removeCustomPrice} 
                disabled={isSaving || !selectedDate || !hasCustomPrice(selectedDate || new Date())}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa giá tùy chỉnh
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatePriceManagement;
