
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

const RoomManagement = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching rooms...');
      const { data, error } = await supabase
        .from('room_types')
        .select('*');

      if (error) {
        throw error;
      }

      console.log('Rooms fetched:', data?.length || 0);
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Không thể tải dữ liệu phòng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quản Lý Phòng</h3>
        <Button onClick={fetchRooms} variant="outline" size="sm">
          Làm mới
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-4">Chưa có phòng nào</div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Phòng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Sức chứa</TableHead>
                <TableHead>Nổi bật</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.is_popular ? 'Có' : 'Không'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Chỉnh sửa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
