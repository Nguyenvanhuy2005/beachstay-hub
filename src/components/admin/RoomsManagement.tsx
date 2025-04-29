
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Building, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomType {
  id: string;
  name: string;
  name_en: string;
  price: number;
  weekend_price: number | null;
  image_url: string;
  is_popular: boolean;
  created_at: string;
}

const RoomsManagement = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        console.log('Fetching rooms data...');
        
        const { data, error } = await supabase
          .from('room_types')
          .select('id, name, name_en, price, weekend_price, image_url, is_popular, created_at')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching rooms:', error);
          throw error;
        }
        
        console.log('Rooms data fetched:', data);
        setRooms(data || []);
      } catch (error: any) {
        console.error('Error fetching rooms:', error);
        setError(error.message);
        toast.error('Không thể tải danh sách phòng');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddRoom = () => {
    toast.info('Tính năng đang phát triển');
  };

  const handleEditRoom = (id: string) => {
    toast.info('Tính năng đang phát triển');
  };

  const handleDeleteRoom = (id: string) => {
    toast.info('Tính năng đang phát triển');
  };

  const handleViewRoom = (id: string) => {
    // Navigate to room detail page in new tab
    window.open(`/phong/${id}`, '_blank');
  };

  if (loading) {
    return (
      <Card className="border-olive-200">
        <CardHeader className="bg-olive-50">
          <CardTitle className="text-olive-800">Quản lý phòng</CardTitle>
          <CardDescription className="text-olive-600">
            Quản lý danh sách phòng, thêm, sửa, xóa phòng
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-[250px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-olive-200">
        <CardHeader className="bg-olive-50">
          <CardTitle className="text-olive-800">Quản lý phòng</CardTitle>
          <CardDescription className="text-olive-600">
            Quản lý danh sách phòng, thêm, sửa, xóa phòng
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-red-50 p-4 rounded border border-red-200 text-red-700">
            <p>Có lỗi xảy ra khi tải dữ liệu: {error}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-olive-200">
      <CardHeader className="bg-olive-50">
        <CardTitle className="text-olive-800">Quản lý phòng</CardTitle>
        <CardDescription className="text-olive-600">
          Quản lý danh sách phòng, thêm, sửa, xóa phòng
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-between mb-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Building className="h-5 w-5 text-olive-700" />
            <span>Tổng số: {rooms.length} phòng</span>
          </h3>
          <Button onClick={handleAddRoom} className="bg-olive-600 hover:bg-olive-700 text-white gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Thêm phòng</span>
          </Button>
        </div>
        
        {rooms.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded">
            <p className="text-gray-500">Chưa có phòng nào được tạo</p>
            <Button onClick={handleAddRoom} variant="outline" className="mt-4">
              Tạo phòng đầu tiên
            </Button>
          </div>
        ) : (
          <div className="rounded border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Tên phòng</TableHead>
                  <TableHead>Giá thường</TableHead>
                  <TableHead>Giá cuối tuần</TableHead>
                  <TableHead>Nổi bật</TableHead>
                  <TableHead className="text-right w-[150px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{formatPrice(room.price)}</TableCell>
                    <TableCell>
                      {room.weekend_price ? formatPrice(room.weekend_price) : 'Không có'}
                    </TableCell>
                    <TableCell>
                      {room.is_popular ? 
                        <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">Có</span> : 
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">Không</span>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleViewRoom(room.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleEditRoom(room.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDeleteRoom(room.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomsManagement;
