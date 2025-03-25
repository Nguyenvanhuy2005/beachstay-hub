
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  status: string;
  created_at: string;
  room_type_id: string;
  room_name?: string;
}

interface RoomType {
  id: string;
  name: string;
}

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomTypes, setRoomTypes] = useState<{[key: string]: string}>({});

  // Fetch bookings with better error handling and debugging
  const fetchBookings = async () => {
    console.log('⭐ Bắt đầu tải đơn đặt phòng với bộ lọc:', statusFilter);
    setLoading(true);
    
    try {
      // Build the query
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter if not set to 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Lỗi khi tải đơn đặt phòng:', error);
        toast.error('Không thể tải dữ liệu đặt phòng');
        setLoading(false);
        return;
      }
      
      console.log('Đã tải đơn đặt phòng:', data);
      
      // Fetch room types to display room names
      if (data && data.length > 0) {
        // Get all unique room type IDs from bookings
        const roomTypeIds = [...new Set(data.map(booking => booking.room_type_id))].filter(Boolean);
        
        if (roomTypeIds.length > 0) {
          const { data: roomTypesData, error: roomTypesError } = await supabase
            .from('room_types')
            .select('id, name')
            .in('id', roomTypeIds);
          
          if (!roomTypesError && roomTypesData) {
            // Create map of room type ids to names
            const roomTypeMap: {[key: string]: string} = {};
            roomTypesData.forEach((room: RoomType) => {
              roomTypeMap[room.id] = room.name;
            });
            
            console.log('Dữ liệu loại phòng:', roomTypeMap);
            setRoomTypes(roomTypeMap);
          }
        }
        
        // Enhance bookings with room names
        const enhancedBookings = data.map(booking => ({
          ...booking,
          room_name: booking.room_type_id ? roomTypes[booking.room_type_id] || 'Phòng không xác định' : 'Chưa chọn phòng'
        }));
        
        setBookings(enhancedBookings);
        console.log('Cập nhật dữ liệu đặt phòng:', enhancedBookings);
      } else {
        console.log('Không tìm thấy đơn đặt phòng');
        setBookings([]);
      }
    } catch (error) {
      console.error('Lỗi không xác định khi tải dữ liệu:', error);
      toast.error('Lỗi không xác định khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filter changes
  useEffect(() => {
    // First fetch room types
    const fetchRoomTypes = async () => {
      try {
        const { data: roomTypesData, error: roomTypesError } = await supabase
          .from('room_types')
          .select('id, name');
        
        if (!roomTypesError && roomTypesData) {
          const roomTypeMap: {[key: string]: string} = {};
          roomTypesData.forEach((room: RoomType) => {
            roomTypeMap[room.id] = room.name;
          });
          
          console.log('Dữ liệu loại phòng ban đầu:', roomTypeMap);
          setRoomTypes(roomTypeMap);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu loại phòng:', err);
      }
    };
    
    // Fetch room types first, then bookings
    fetchRoomTypes().then(() => {
      fetchBookings();
    });
  }, [statusFilter]);

  // Update booking status
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      console.log(`Cập nhật trạng thái đơn ${bookingId} thành ${newStatus}`);
      
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select();
      
      if (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn đặt phòng:', error);
        toast.error('Không thể cập nhật trạng thái đặt phòng');
        return;
      }
      
      console.log('Kết quả cập nhật trạng thái:', data);
      
      toast.success(`Đã cập nhật trạng thái đặt phòng thành "${newStatus === 'confirmed' ? 'Đã xác nhận' : newStatus === 'cancelled' ? 'Đã hủy' : 'Đang chờ'}"`);
      
      // Update local state to reflect the change
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
    } catch (error) {
      console.error('Lỗi không xác định khi cập nhật trạng thái:', error);
      toast.error('Không thể cập nhật trạng thái đặt phòng');
    }
  };

  // Helper function to render status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Đã xác nhận</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Đang chờ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Quản lý đặt phòng
        </CardTitle>
        <CardDescription>
          Quản lý các đơn đặt phòng, phê duyệt hoặc từ chối đơn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchBookings}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Làm mới
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-beach-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không có đơn đặt phòng nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Loại phòng</TableHead>
                  <TableHead>Ngày nhận/trả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.full_name}</div>
                      <div className="text-sm text-muted-foreground">{booking.email}</div>
                      <div className="text-sm text-muted-foreground">{booking.phone}</div>
                    </TableCell>
                    <TableCell>
                      {booking.room_name || roomTypes[booking.room_type_id] || 'Không xác định'}
                    </TableCell>
                    <TableCell>
                      <div>{format(new Date(booking.check_in), 'dd/MM/yyyy')}</div>
                      <div className="text-sm text-muted-foreground">
                        đến {format(new Date(booking.check_out), 'dd/MM/yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Xác nhận
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Hủy
                          </Button>
                        )}
                        {booking.status === 'cancelled' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-amber-500 text-amber-500 hover:bg-amber-50"
                            onClick={() => handleStatusChange(booking.id, 'pending')}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Khôi phục
                          </Button>
                        )}
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

export default BookingsManagement;
