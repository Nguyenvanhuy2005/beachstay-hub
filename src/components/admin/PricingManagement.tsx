
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import DatePriceManagement from './DatePriceManagement';

interface RoomType {
  id: string;
  name: string;
  price: number;
  weekend_price: number | null;
}

const PricingManagement = () => {
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [regularPrice, setRegularPrice] = useState<string>('');
  const [weekendPrice, setWeekendPrice] = useState<string>('');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchRoomTypes();
  }, []);
  
  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('id, name, price, weekend_price')
        .order('name');
        
      if (error) throw error;
      
      setRoomTypes(data || []);
      
      if (data && data.length > 0) {
        setSelectedRoomId(data[0].id);
        setRegularPrice(data[0].price.toString());
        setWeekendPrice(data[0].weekend_price?.toString() || data[0].price.toString());
      }
    } catch (error) {
      console.error('Lỗi khi tải loại phòng:', error);
      toast.error('Không thể tải loại phòng');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedRoomId) {
      const selectedRoom = roomTypes.find(room => room.id === selectedRoomId);
      if (selectedRoom) {
        setRegularPrice(selectedRoom.price.toString());
        setWeekendPrice(selectedRoom.weekend_price?.toString() || selectedRoom.price.toString());
      }
    }
  }, [selectedRoomId, roomTypes]);
  
  const handleSaveBasePrices = async () => {
    if (!selectedRoomId || !regularPrice) return;
    
    setSaving(true);
    try {
      const regularPriceValue = parseFloat(regularPrice);
      const weekendPriceValue = weekendPrice ? parseFloat(weekendPrice) : regularPriceValue;
      
      if (isNaN(regularPriceValue) || isNaN(weekendPriceValue)) {
        toast.error('Giá không hợp lệ');
        return;
      }
      
      const { error } = await supabase
        .from('room_types')
        .update({
          price: regularPriceValue,
          weekend_price: weekendPriceValue
        })
        .eq('id', selectedRoomId);
        
      if (error) throw error;
      
      // Cập nhật dữ liệu trong state
      setRoomTypes(prev => 
        prev.map(room => 
          room.id === selectedRoomId 
            ? { ...room, price: regularPriceValue, weekend_price: weekendPriceValue } 
            : room
        )
      );
      
      toast.success('Đã cập nhật giá cơ bản');
    } catch (error) {
      console.error('Lỗi khi cập nhật giá:', error);
      toast.error('Không thể cập nhật giá');
    } finally {
      setSaving(false);
    }
  };
  
  const formatPriceInMillions = (price: number): string => {
    const inMillions = price / 1000000;
    return `${inMillions.toFixed(1)}M`;
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quản lý giá phòng</CardTitle>
          <CardDescription>
            Quản lý giá phòng theo thời gian, mùa, dịp lễ
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-beach-600" />
        </CardContent>
      </Card>
    );
  }
  
  if (roomTypes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quản lý giá phòng</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            Không có loại phòng nào. Vui lòng tạo loại phòng trước.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý giá phòng</CardTitle>
        <CardDescription>
          Quản lý giá phòng theo thời gian, mùa, dịp lễ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <Label htmlFor="room-type">Chọn loại phòng</Label>
          <Select
            value={selectedRoomId}
            onValueChange={setSelectedRoomId}
          >
            <SelectTrigger id="room-type" className="w-full max-w-md">
              <SelectValue placeholder="Chọn loại phòng" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map(room => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name} - {formatPriceInMillions(room.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="base-prices" className="w-full mt-4">
          <TabsList>
            <TabsTrigger value="base-prices">
              Giá cơ bản
            </TabsTrigger>
            <TabsTrigger value="date-prices">
              Giá theo ngày
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="base-prices" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="regular-price">
                  Giá ngày thường
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="regular-price"
                    type="number"
                    min="0"
                    step="10000"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-muted-foreground">VND</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Áp dụng cho các ngày trong tuần (trừ Thứ 7)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weekend-price">
                  Giá cuối tuần
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="weekend-price"
                    type="number"
                    min="0"
                    step="10000"
                    value={weekendPrice}
                    onChange={(e) => setWeekendPrice(e.target.value)}
                    className="w-full"
                  />
                  <span className="text-muted-foreground">VND</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Áp dụng cho Thứ 7
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveBasePrices}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu giá cơ bản
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="date-prices" className="mt-4">
            {selectedRoomId && (
              <DatePriceManagement 
                roomId={selectedRoomId} 
                regularPrice={parseFloat(regularPrice) || 0}
                weekendPrice={parseFloat(weekendPrice) || 0}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PricingManagement;
