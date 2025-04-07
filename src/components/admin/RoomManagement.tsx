
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Image, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import AddRoomModal from './AddRoomModal';
import EditRoomModal from './EditRoomModal';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RoomManagement = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      toast.error('Không thể tải dữ liệu phòng: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRoom = (id: string) => {
    setCurrentRoomId(id);
    setEditModalOpen(true);
  };

  const handleDeleteRoom = async (id: string) => {
    setDeleteError(null);
    try {
      // First check if there are any bookings using this room type
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_type_id', id)
        .limit(1);

      if (bookingsError) {
        throw bookingsError;
      }

      // If there are bookings for this room type, we can't delete it
      if (bookings && bookings.length > 0) {
        setDeleteError('Không thể xóa phòng vì đã có đặt phòng sử dụng loại phòng này. Bạn cần xóa các đặt phòng liên quan trước.');
        return;
      }

      const { data: existingRoom, error: checkError } = await supabase
        .from('room_types')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (!existingRoom) {
        toast.error('Không tìm thấy phòng để xóa');
        return;
      }

      const { error } = await supabase
        .from('room_types')
        .delete()
        .eq('id', id);

      if (error) {
        // Specific error for foreign key constraint violation
        if (error.message.includes('violates foreign key constraint')) {
          setDeleteError('Không thể xóa phòng này vì còn tồn tại đặt phòng liên quan. Bạn cần xóa các đặt phòng liên quan trước khi xóa phòng.');
          return;
        }
        throw error;
      }
      
      toast.success('Đã xóa phòng thành công');
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Không thể xóa phòng: ' + (error as any).message);
    } finally {
      if (!deleteError) {
        setRoomToDelete(null);
      }
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
      toast.error('Không thể cập nhật trạng thái phòng: ' + (error as any).message);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quản Lý Phòng</h3>
        <div className="flex space-x-2">
          <Button onClick={fetchRooms} variant="outline" size="sm">
            <RefreshCw className="mr-1 h-4 w-4" /> Làm mới
          </Button>
          <Button onClick={() => setAddModalOpen(true)} size="sm">
            <Plus className="mr-1 h-4 w-4" /> Thêm phòng
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          <p className="mt-2">Đang tải...</p>
        </div>
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
                <TableHead>Giá ngày thường</TableHead>
                <TableHead>Giá cuối tuần/lễ</TableHead>
                <TableHead>Sức chứa</TableHead>
                <TableHead className="text-center">Nổi bật</TableHead>
                <TableHead className="text-center">Hình ảnh</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{formatPrice(room.price)}</TableCell>
                  <TableCell>{formatPrice(room.weekend_price || room.price)}</TableCell>
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
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8"
                          >
                            <div className="relative">
                              <Image className="h-5 w-5 text-muted-foreground" />
                              {room.gallery_images && room.gallery_images.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 text-xs bg-beach-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                  {room.gallery_images.length}
                                </span>
                              )}
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="p-1">
                            <p className="text-sm font-medium mb-1">Thư viện hình ảnh ({room.gallery_images?.length || 0})</p>
                            {room.gallery_images && room.gallery_images.length > 0 ? (
                              <div className="grid grid-cols-3 gap-1 max-w-[300px]">
                                {room.gallery_images.map((img: string, idx: number) => (
                                  <div key={idx} className="h-16 w-16 rounded overflow-hidden">
                                    <img src={img} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Không có hình ảnh</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditRoom(room.id)}
                      >
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

      <EditRoomModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onRoomUpdated={fetchRooms}
        roomId={currentRoomId}
      />

      <AlertDialog open={!!roomToDelete} onOpenChange={(open) => !open && setRoomToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError ? (
                <div className="flex items-start space-x-2 text-red-600">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{deleteError}</span>
                </div>
              ) : (
                "Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể hoàn tác."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            {!deleteError && (
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600"
                onClick={() => roomToDelete && handleDeleteRoom(roomToDelete)}
              >
                Xóa
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomManagement;
