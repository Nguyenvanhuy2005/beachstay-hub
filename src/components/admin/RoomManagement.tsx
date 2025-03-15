
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import AddRoomModal from './AddRoomModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RoomManagement = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching rooms...');
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('name');

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

  const handleDeleteRoom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('room_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Đã xóa phòng thành công');
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Không thể xóa phòng');
    } finally {
      setRoomToDelete(null);
    }
  };

  const togglePopular = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('room_types')
        .update({ is_popular: !currentValue })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Đã ${!currentValue ? 'đánh dấu' : 'bỏ đánh dấu'} phòng nổi bật`);
      fetchRooms();
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Không thể cập nhật trạng thái phòng');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quản Lý Phòng</h3>
        <div className="flex space-x-2">
          <Button onClick={fetchRooms} variant="outline" size="sm">
            Làm mới
          </Button>
          <Button onClick={() => setAddModalOpen(true)} size="sm">
            <Plus className="mr-1 h-4 w-4" /> Thêm phòng
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 bg-muted/40 rounded-md">
          <h3 className="text-lg font-medium mb-2">Chưa có phòng nào</h3>
          <p className="text-muted-foreground mb-4">Hãy thêm phòng đầu tiên cho khách sạn của bạn</p>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Thêm phòng mới
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Phòng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Sức chứa</TableHead>
                <TableHead className="text-center">Nổi bật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => togglePopular(room.id, room.is_popular)}
                      className="h-8 w-8"
                    >
                      {room.is_popular ? 
                        <CheckCircle className="h-5 w-5 text-green-500" /> : 
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      }
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4 mr-1" /> Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => setRoomToDelete(room.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddRoomModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen} 
        onRoomAdded={fetchRooms}
      />

      <AlertDialog open={!!roomToDelete} onOpenChange={(open) => !open && setRoomToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => roomToDelete && handleDeleteRoom(roomToDelete)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomManagement;
