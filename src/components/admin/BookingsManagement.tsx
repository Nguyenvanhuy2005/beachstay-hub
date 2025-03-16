
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { getBookingsByStatus, updateBookingStatus } from '@/api/bookingApi';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

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

const BookingsManagement = () => {
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomTypes, setRoomTypes] = useState<{[key: string]: string}>({});

  // Lấy danh sách đặt phòng
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter : undefined;
      const fetchedBookings = await getBookingsByStatus(status);
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt phòng:', error);
      toast.error(language === 'vi' ? 'Không thể tải dữ liệu đặt phòng' : 'Could not load booking data');
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin loại phòng
  const fetchRoomTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('id, name');
      
      if (error) throw error;
      
      const roomTypeMap: {[key: string]: string} = {};
      data?.forEach(room => {
        roomTypeMap[room.id] = room.name;
      });
      
      setRoomTypes(roomTypeMap);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin loại phòng:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchRoomTypes();
  }, [statusFilter]);

  // Cập nhật trạng thái đặt phòng
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const result = await updateBookingStatus(bookingId, newStatus);
      
      if (result.success) {
        toast.success(
          language === 'vi' 
            ? `Đã cập nhật trạng thái đặt phòng thành "${newStatus}"` 
            : `Booking status updated to "${newStatus}"`
        );
        
        // Cập nhật danh sách đặt phòng
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: newStatus } 
              : booking
          )
        );
      } else {
        throw new Error(result.error as any);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error(
        language === 'vi' 
          ? 'Không thể cập nhật trạng thái đặt phòng' 
          : 'Could not update booking status'
      );
    }
  };

  // Hiển thị badge trạng thái
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">{language === 'vi' ? 'Đã xác nhận' : 'Confirmed'}</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">{language === 'vi' ? 'Đã hủy' : 'Cancelled'}</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">{language === 'vi' ? 'Đang chờ' : 'Pending'}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Chọn trạng thái để lọc
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'vi' ? 'Quản lý đặt phòng' : 'Bookings Management'}
        </CardTitle>
        <CardDescription>
          {language === 'vi' 
            ? 'Quản lý các đơn đặt phòng, phê duyệt hoặc từ chối đơn' 
            : 'Manage booking requests, approve or reject bookings'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Select 
              value={statusFilter}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={language === 'vi' ? "Lọc theo trạng thái" : "Filter by status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'vi' ? 'Tất cả' : 'All'}</SelectItem>
                <SelectItem value="pending">{language === 'vi' ? 'Đang chờ' : 'Pending'}</SelectItem>
                <SelectItem value="confirmed">{language === 'vi' ? 'Đã xác nhận' : 'Confirmed'}</SelectItem>
                <SelectItem value="cancelled">{language === 'vi' ? 'Đã hủy' : 'Cancelled'}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchBookings()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {language === 'vi' ? 'Làm mới' : 'Refresh'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-beach-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {language === 'vi' 
              ? 'Không có đơn đặt phòng nào' 
              : 'No bookings found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'vi' ? 'Khách hàng' : 'Customer'}</TableHead>
                  <TableHead>{language === 'vi' ? 'Loại phòng' : 'Room Type'}</TableHead>
                  <TableHead>{language === 'vi' ? 'Ngày nhận/trả' : 'Check-in/out'}</TableHead>
                  <TableHead>{language === 'vi' ? 'Trạng thái' : 'Status'}</TableHead>
                  <TableHead>{language === 'vi' ? 'Thao tác' : 'Actions'}</TableHead>
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
                      {roomTypes[booking.room_type_id] || language === 'vi' ? 'Không xác định' : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div>{format(new Date(booking.check_in), 'dd/MM/yyyy')}</div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'vi' ? 'đến' : 'to'} {format(new Date(booking.check_out), 'dd/MM/yyyy')}
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
                              {language === 'vi' ? 'Xác nhận' : 'Confirm'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              {language === 'vi' ? 'Từ chối' : 'Cancel'}
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
                            {language === 'vi' ? 'Hủy' : 'Cancel'}
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
                            {language === 'vi' ? 'Khôi phục' : 'Restore'}
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
