
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format, isSameDay, isWeekend } from 'date-fns';
import { CalendarIcon, Trash2, Save, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

  // Load custom prices for this room
  useEffect(() => {
    if (!roomId) return;
    
    const fetchCustomPrices = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('room_date_prices')
          .select('*')
          .eq('room_type_id', roomId);
          
        if (error) throw error;
        
        setCustomPrices(data || []);
      } catch (error) {
        console.error('Error fetching custom prices:', error);
        toast.error('Không thể tải giá tùy chỉnh');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomPrices();
  }, [roomId]);

  // When a date is selected, set the price input to the current price for that date
  useEffect(() => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingCustomPrice = customPrices.find(
      item => item.date === dateStr
    );
    
    if (existingCustomPrice) {
      setCustomPrice(existingCustomPrice.price.toString());
    } else {
      // Default to weekend price if it's a weekend, otherwise regular price
      const defaultPrice = isWeekend(selectedDate) ? weekendPrice : regularPrice;
      setCustomPrice(defaultPrice.toString());
    }
  }, [selectedDate, customPrices, regularPrice, weekendPrice]);

  // Function to save a custom price for the selected date
  const saveCustomPrice = async () => {
    if (!selectedDate || !customPrice || !roomId) return;
    
    setIsSaving(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const priceValue = parseFloat(customPrice);
      
      if (isNaN(priceValue)) {
        toast.error('Giá không hợp lệ');
        return;
      }
      
      // Check if there's already a custom price for this date
      const existingCustomPrice = customPrices.find(
        item => item.date === dateStr
      );
      
      if (existingCustomPrice) {
        // Update existing custom price
        const { error } = await supabase
          .from('room_date_prices')
          .update({ price: priceValue })
          .eq('id', existingCustomPrice.id);
          
        if (error) throw error;
        
        // Update local state
        setCustomPrices(prev => 
          prev.map(item => 
            item.id === existingCustomPrice.id 
              ? { ...item, price: priceValue } 
              : item
          )
        );
        
        toast.success('Đã cập nhật giá tùy chỉnh');
      } else {
        // Insert new custom price
        const { data, error } = await supabase
          .from('room_date_prices')
          .insert({
            room_type_id: roomId,
            date: dateStr,
            price: priceValue
          })
          .select('*')
          .single();
          
        if (error) throw error;
        
        // Add to local state
        setCustomPrices(prev => [...prev, data]);
        
        toast.success('Đã thêm giá tùy chỉnh');
      }
    } catch (error) {
      console.error('Error saving custom price:', error);
      toast.error('Không thể lưu giá tùy chỉnh');
    } finally {
      setIsSaving(false);
    }
  };

  // Function to remove a custom price for the selected date
  const removeCustomPrice = async () => {
    if (!selectedDate || !roomId) return;
    
    setIsSaving(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      // Check if there's a custom price for this date
      const existingCustomPrice = customPrices.find(
        item => item.date === dateStr
      );
      
      if (existingCustomPrice) {
        // Delete the custom price
        const { error } = await supabase
          .from('room_date_prices')
          .delete()
          .eq('id', existingCustomPrice.id);
          
        if (error) throw error;
        
        // Update local state
        setCustomPrices(prev => 
          prev.filter(item => item.id !== existingCustomPrice.id)
        );
        
        // Reset the price input to the default for this date
        const defaultPrice = isWeekend(selectedDate) ? weekendPrice : regularPrice;
        setCustomPrice(defaultPrice.toString());
        
        toast.success('Đã xóa giá tùy chỉnh');
      } else {
        toast.info('Không có giá tùy chỉnh để xóa');
      }
    } catch (error) {
      console.error('Error removing custom price:', error);
      toast.error('Không thể xóa giá tùy chỉnh');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to check if a date has a custom price
  const hasCustomPrice = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return customPrices.some(item => item.date === dateStr);
  };

  // Render custom day contents with price indicators
  const renderDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const customPriceItem = customPrices.find(item => item.date === dateStr);
    
    const price = customPriceItem
      ? customPriceItem.price
      : isWeekend(day)
        ? weekendPrice
        : regularPrice;
    
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
    
    return (
      <div className="flex flex-col items-center">
        <div>{day.getDate()}</div>
        <div className={`text-[9px] mt-1 ${customPriceItem ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
          {formattedPrice}
        </div>
      </div>
    );
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
              onSelect={setSelectedDate}
              components={{
                Day: ({ date }) => renderDay(date)
              }}
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
                ) : isWeekend(selectedDate) ? (
                  <span className="text-orange-600">Giá cuối tuần</span>
                ) : (
                  <span className="text-gray-600">Giá ngày thường</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-price">Giá tùy chỉnh</Label>
              <Input
                id="custom-price"
                type="number"
                min="0"
                step="10000"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Giá mặc định: {isWeekend(selectedDate || new Date()) 
                  ? `${new Intl.NumberFormat('vi-VN').format(weekendPrice)} đ (cuối tuần)` 
                  : `${new Intl.NumberFormat('vi-VN').format(regularPrice)} đ (ngày thường)`}
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
                Lưu giá
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
