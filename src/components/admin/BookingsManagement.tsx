
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomTypes, setRoomTypes] = useState<{[key: string]: string}>({});

  // Fetch bookings with better error handling and debugging
  const fetchBookings = async () => {
    console.log('⭐ Starting to fetch bookings with filter:', statusFilter);
    setLoading(true);
    
    try {
      // Fetch room types first to ensure we have them for mapping
      const { data: roomTypesData, error: roomTypesError } = await supabase
        .from('room_types')
        .select('id, name');
      
      if (roomTypesError) {
        console.error('Error fetching room types:', roomTypesError);
      } else if (roomTypesData) {
        // Create map of room type ids to names
        const roomTypeMap: {[key: string]: string} = {};
        roomTypesData.forEach((room: RoomType) => {
          roomTypeMap[room.id] = room.name;
        });
        
        console.log('Room type map:', roomTypeMap);
        setRoomTypes(roomTypeMap);
      }
      
      // Build the query for bookings
      let query = supabase
        .from('bookings')
        .select('*');
      
      // Apply status filter if not set to 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Add sorting to get newest bookings first
      query = query.order('created_at', { ascending: false });
      
      // Execute the query
      const { data: bookingsData, error: bookingsError } = await query;
      
      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        toast.error(language === 'vi' ? 'Không thể tải dữ liệu đặt phòng' : 'Could not load booking data');
        setLoading(false);
        return;
      }
      
      console.log('Fetched bookings:', bookingsData);
      
      if (bookingsData && bookingsData.length > 0) {
        // Enhance bookings with room names - FIX: Use roomTypes instead of roomTypeMap
        const enhancedBookings = bookingsData.map(booking => ({
          ...booking,
          room_name: booking.room_type_id ? roomTypes[booking.room_type_id] || 'Unknown Room' : 'No Room Selected'
        }));
        
        setBookings(enhancedBookings);
        console.log('Set enhanced bookings:', enhancedBookings);
      } else {
        console.log('No bookings found');
        setBookings([]);
      }
    } catch (error) {
      console.error('Unexpected error in fetchBookings:', error);
      toast.error(language === 'vi' ? 'Lỗi không xác định khi tải dữ liệu' : 'Unexpected error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filter changes
  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  // Update booking status
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      console.log(`Updating booking ${bookingId} status to ${newStatus}`);
      
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select();
      
      if (error) {
        console.error('Error updating booking status:', error);
        toast.error(
          language === 'vi' 
            ? 'Không thể cập nhật trạng thái đặt phòng' 
            : 'Could not update booking status'
        );
        return;
      }
      
      console.log('Status update result:', data);
      
      toast.success(
        language === 'vi' 
          ? `Đã cập nhật trạng thái đặt phòng thành "${newStatus}"` 
          : `Booking status updated to "${newStatus}"`
      );
      
      // Update local state to reflect the change
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
    } catch (error) {
      console.error('Unexpected error updating status:', error);
      toast.error(
        language === 'vi' 
          ? 'Không thể cập nhật trạng thái đặt phòng' 
          : 'Could not update booking status'
      );
    }
  };

  // Helper function to render status badges
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

  // Format date to display in Vietnamese format
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error(`Error formatting date ${dateStr}:`, error);
      return dateStr;
    }
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
              onValueChange={setStatusFilter}
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
              onClick={fetchBookings}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
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
                      {booking.room_name || (booking.room_type_id && roomTypes[booking.room_type_id]) || (language === 'vi' ? 'Không xác định' : 'Unknown')}
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(booking.check_in)}</div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'vi' ? 'đến' : 'to'} {formatDate(booking.check_out)}
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
