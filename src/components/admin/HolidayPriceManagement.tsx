
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Save, Trash2, Plus } from 'lucide-react';

interface HolidayPriceManagementProps {
  roomId: string;
}

interface HolidayPrice {
  id: string;
  holiday_name: string;
  holiday_name_en: string;
  holiday_type: 'solar' | 'lunar';
  month: number;
  day: number;
  price: number;
  multiplier: number;
  is_active: boolean;
}

const HolidayPriceManagement: React.FC<HolidayPriceManagementProps> = ({ roomId }) => {
  const [holidayPrices, setHolidayPrices] = useState<HolidayPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    fetchHolidayPrices();
  }, [roomId]);

  const fetchHolidayPrices = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching holiday prices for room:', roomId);
      
      const { data, error } = await supabase
        .from('holiday_prices')
        .select('*')
        .eq('room_type_id', roomId)
        .order('holiday_type', { ascending: true })
        .order('month', { ascending: true })
        .order('day', { ascending: true });

      if (error) {
        console.error('Error fetching holiday prices:', error);
        toast.error(`Không thể tải giá ngày lễ: ${error.message}`);
        return;
      }

      console.log('Fetched holiday prices:', data);
      setHolidayPrices(data || []);
    } catch (error) {
      console.error('Unexpected error fetching holiday prices:', error);
      toast.error('Lỗi không mong đợi khi tải giá ngày lễ');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHolidayPrice = async (id: string, price: number, multiplier: number) => {
    setIsSaving(true);
    try {
      console.log('Updating holiday price:', { id, price, multiplier });

      const { data, error } = await supabase
        .from('holiday_prices')
        .update({ 
          price: price,
          multiplier: multiplier,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating holiday price:', error);
        toast.error(`Không thể cập nhật giá ngày lễ: ${error.message}`);
        return;
      }

      console.log('Successfully updated holiday price:', data);
      
      setHolidayPrices(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, price: price, multiplier: multiplier } 
            : item
        )
      );

      toast.success('Đã cập nhật giá ngày lễ');
      setEditingId(null);
    } catch (error) {
      console.error('Unexpected error updating holiday price:', error);
      toast.error('Lỗi không mong đợi khi cập nhật giá ngày lễ');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActiveStatus = async (id: string, isActive: boolean) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('holiday_prices')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) {
        console.error('Error toggling holiday price status:', error);
        toast.error(`Không thể thay đổi trạng thái: ${error.message}`);
        return;
      }

      setHolidayPrices(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, is_active: !isActive } 
            : item
        )
      );

      toast.success(`Đã ${!isActive ? 'kích hoạt' : 'tắt'} giá ngày lễ`);
    } catch (error) {
      console.error('Unexpected error toggling holiday price status:', error);
      toast.error('Lỗi không mong đợi');
    } finally {
      setIsSaving(false);
    }
  };

  const formatPriceInMillions = (price: number): string => {
    const inMillions = price / 1000000;
    return `${inMillions.toFixed(1)}M`;
  };

  const getHolidayTypeText = (type: string) => {
    return type === 'solar' ? 'Dương lịch' : 'Âm lịch';
  };

  const HolidayPriceRow: React.FC<{ holiday: HolidayPrice }> = ({ holiday }) => {
    const [localPrice, setLocalPrice] = useState(holiday.price.toString());
    const [localMultiplier, setLocalMultiplier] = useState(holiday.multiplier.toString());
    const isEditing = editingId === holiday.id;

    const handleSave = () => {
      const priceValue = parseFloat(localPrice);
      const multiplierValue = parseFloat(localMultiplier);

      if (isNaN(priceValue) || priceValue <= 0) {
        toast.error('Giá phải là số dương lớn hơn 0');
        return;
      }

      if (isNaN(multiplierValue) || multiplierValue <= 0) {
        toast.error('Hệ số nhân phải là số dương lớn hơn 0');
        return;
      }

      updateHolidayPrice(holiday.id, priceValue, multiplierValue);
    };

    const handleCancel = () => {
      setLocalPrice(holiday.price.toString());
      setLocalMultiplier(holiday.multiplier.toString());
      setEditingId(null);
    };

    return (
      <TableRow className={!holiday.is_active ? 'opacity-50' : ''}>
        <TableCell className="font-medium">
          {holiday.holiday_name}
        </TableCell>
        <TableCell>
          {getHolidayTypeText(holiday.holiday_type)}
        </TableCell>
        <TableCell>
          {holiday.day}/{holiday.month}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Input
              type="number"
              value={localPrice}
              onChange={(e) => setLocalPrice(e.target.value)}
              className="w-32"
              min="0"
              step="10000"
            />
          ) : (
            formatPriceInMillions(holiday.price)
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Input
              type="number"
              value={localMultiplier}
              onChange={(e) => setLocalMultiplier(e.target.value)}
              className="w-24"
              min="0"
              step="0.1"
            />
          ) : (
            `x${holiday.multiplier}`
          )}
        </TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs ${
            holiday.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {holiday.is_active ? 'Hoạt động' : 'Tạm dừng'}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingId(holiday.id)}
                  disabled={isSaving}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant={holiday.is_active ? "destructive" : "default"}
                  onClick={() => toggleActiveStatus(holiday.id, holiday.is_active)}
                  disabled={isSaving}
                >
                  {holiday.is_active ? 'Tắt' : 'Bật'}
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quản lý giá ngày lễ</CardTitle>
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
        <CardTitle>Quản lý giá ngày lễ</CardTitle>
      </CardHeader>
      <CardContent>
        {holidayPrices.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Chưa có giá ngày lễ nào được thiết lập
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Quản lý giá đặc biệt cho các ngày lễ trong năm. Hệ số nhân sẽ được áp dụng với giá cơ bản.
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên ngày lễ</TableHead>
                  <TableHead>Loại lịch</TableHead>
                  <TableHead>Ngày/Tháng</TableHead>
                  <TableHead>Giá (VND)</TableHead>
                  <TableHead>Hệ số nhân</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidayPrices.map((holiday) => (
                  <HolidayPriceRow key={holiday.id} holiday={holiday} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HolidayPriceManagement;
