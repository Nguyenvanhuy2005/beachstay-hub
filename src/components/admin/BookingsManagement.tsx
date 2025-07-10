import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle, Eye, Calendar, Users, CreditCard, MapPin } from 'lucide-react';
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
  special_requests?: string;
}

interface RoomType {
  id: string;
  name: string;
  price: number;
  weekend_price?: number;
}

interface BookingDetails extends Booking {
  room_details: RoomType;
  total_nights: number;
  base_price: number;
  total_price: number;
  price_breakdown: string[];
}

const BookingsManagement = () => {
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomTypes, setRoomTypes] = useState<{[key: string]: RoomType}>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch room types first - this is critical to fix the issue
  const fetchRoomTypes = async () => {
    try {
      console.log('⭐ Fetching room types...');
      
      const { data: roomTypesData, error: roomTypesError } = await supabase
        .from('room_types')
        .select('id, name, price, weekend_price');
      
      if (roomTypesError) {
        console.error('Error fetching room types:', roomTypesError);
        setError(roomTypesError.message);
        return {};
      } 
      
      if (!roomTypesData || roomTypesData.length === 0) {
        console.warn('No room types found in database');
        return {};
      }
      
      // Create map of room type ids to full objects
      const roomTypeMap: {[key: string]: RoomType} = {};
      roomTypesData.forEach((room: RoomType) => {
        roomTypeMap[room.id] = room;
      });
      
      console.log('Room type map created:', roomTypeMap);
      setRoomTypes(roomTypeMap);
      return roomTypeMap;
    } catch (error) {
      console.error('Unexpected error fetching room types:', error);
      setError(error instanceof Error ? error.message : 'Unknown error fetching room types');
      return {};
    }
  };

  // Fetch bookings with better error handling and debugging
  const fetchBookings = async () => {
    console.log('⭐ Starting to fetch bookings with filter:', statusFilter);
    setLoading(true);
    setError(null);
    
    try {
      // First ensure we have room types
      const roomTypeMap = await fetchRoomTypes();
      console.log('Room types fetched successfully:', roomTypeMap);
      
      // Build the query for bookings
      console.log('Building bookings query...');
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
      console.log('Executing bookings query...');
      const { data: bookingsData, error: bookingsError } = await query;
      
      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        toast.error(language === 'vi' ? 'Không thể tải dữ liệu đặt phòng' : 'Could not load booking data');
        setError(bookingsError.message);
        setLoading(false);
        return;
      }
      
      console.log('Fetched bookings count:', bookingsData?.length || 0);
      console.log('Fetched bookings data sample:', bookingsData?.slice(0, 2) || 'No data');
      
      if (bookingsData && bookingsData.length > 0) {
        // Enhance bookings with room names
        const enhancedBookings = bookingsData.map(booking => {
          const roomDetails = booking.room_type_id ? roomTypeMap[booking.room_type_id] : null;
          console.log(`Mapping booking ${booking.id} to room: ${roomDetails?.name || 'Not found'} (room_type_id: ${booking.room_type_id})`);
          
          return {
            ...booking,
            room_name: roomDetails?.name || (language === 'vi' ? 'Không xác định' : 'Unknown Room')
          };
        });
        
        setBookings(enhancedBookings);
        console.log('Set enhanced bookings:', enhancedBookings);
      } else {
        console.log('No bookings found');
        setBookings([]);
      }
    } catch (error) {
      console.error('Unexpected error in fetchBookings:', error);
      setError(error instanceof Error ? error.message : 'Unknown error fetching bookings');
      toast.error(language === 'vi' ? 'Lỗi không xác định khi tải dữ liệu' : 'Unexpected error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filter changes
  useEffect(() => {
    console.log('⭐ BookingsManagement component mounted or filter changed');
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

  // Calculate booking details including pricing
  const calculateBookingDetails = (booking: Booking): BookingDetails => {
    const roomDetails = roomTypes[booking.room_type_id];
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const totalNights = differenceInDays(checkOut, checkIn);
    
    let totalPrice = 0;
    const priceBreakdown: string[] = [];
    
    if (roomDetails) {
      const basePrice = roomDetails.price;
      const weekendPrice = roomDetails.weekend_price || basePrice;
      
      // Calculate price for each night
      for (let i = 0; i < totalNights; i++) {
        const currentDate = new Date(checkIn);
        currentDate.setDate(currentDate.getDate() + i);
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
        
        const nightPrice = isWeekend ? weekendPrice : basePrice;
        totalPrice += nightPrice;
        
        priceBreakdown.push(
          `${format(currentDate, 'dd/MM/yyyy')}: ${nightPrice.toLocaleString('vi-VN')}đ ${isWeekend ? '(cuối tuần)' : ''}`
        );
      }
    }
    
    return {
      ...booking,
      room_details: roomDetails,
      total_nights: totalNights,
      base_price: roomDetails?.price || 0,
      total_price: totalPrice,
      price_breakdown: priceBreakdown
    };
  };

  // Handle view booking details
  const handleViewDetails = async (booking: Booking) => {
    setDetailsLoading(true);
    try {
      const bookingDetails = calculateBookingDetails(booking);
      setSelectedBooking(bookingDetails);
    } catch (error) {
      console.error('Error calculating booking details:', error);
      toast.error(language === 'vi' ? 'Không thể tải chi tiết đặt phòng' : 'Could not load booking details');
    } finally {
      setDetailsLoading(false);
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
      <CardContent className="pt-6">
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
        
        {error && (
          <div className="mb-4 p-4 border border-red-200 rounded bg-red-50 text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">{language === 'vi' ? 'Lỗi' : 'Error'}</p>
              <p>{error}</p>
            </div>
          </div>
        )}

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
                  <TableHead>{language === 'vi' ? 'Khách' : 'Guests'}</TableHead>
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
                      {booking.room_name || (language === 'vi' ? 'Không xác định' : 'Unknown')}
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(booking.check_in)}</div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'vi' ? 'đến' : 'to'} {formatDate(booking.check_out)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{booking.adults}</span> {language === 'vi' ? 'người lớn' : 'adults'}
                        {booking.children > 0 && (
                          <span>, <span className="font-medium">{booking.children}</span> {language === 'vi' ? 'trẻ em' : 'children'}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8"
                          onClick={() => handleViewDetails(booking)}
                          disabled={detailsLoading}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {language === 'vi' ? 'Chi tiết' : 'Details'}
                        </Button>
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

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {language === 'vi' ? 'Chi tiết đặt phòng' : 'Booking Details'}
            </DialogTitle>
            <DialogDescription>
              {language === 'vi' ? 'Thông tin chi tiết về đơn đặt phòng' : 'Detailed information about the booking'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {language === 'vi' ? 'Thông tin khách hàng' : 'Customer Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Họ tên' : 'Full Name'}</p>
                    <p className="font-medium">{selectedBooking.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Số điện thoại' : 'Phone'}</p>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Số khách' : 'Guests'}</p>
                    <p className="font-medium">
                      {selectedBooking.adults} {language === 'vi' ? 'người lớn' : 'adults'}
                      {selectedBooking.children > 0 && `, ${selectedBooking.children} ${language === 'vi' ? 'trẻ em' : 'children'}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {language === 'vi' ? 'Thông tin đặt phòng' : 'Booking Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Loại phòng' : 'Room Type'}</p>
                    <p className="font-medium">{selectedBooking.room_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Trạng thái' : 'Status'}</p>
                    <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Ngày nhận phòng' : 'Check-in'}</p>
                    <p className="font-medium">{formatDate(selectedBooking.check_in)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Ngày trả phòng' : 'Check-out'}</p>
                    <p className="font-medium">{formatDate(selectedBooking.check_out)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Số đêm' : 'Total Nights'}</p>
                    <p className="font-medium">{selectedBooking.total_nights} {language === 'vi' ? 'đêm' : 'nights'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Ngày đặt' : 'Booking Date'}</p>
                    <p className="font-medium">{formatDate(selectedBooking.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {language === 'vi' ? 'Thông tin giá' : 'Pricing Information'}
                </h3>
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Giá cơ bản' : 'Base Price'}</p>
                      <p className="font-medium">{selectedBooking.base_price.toLocaleString('vi-VN')}đ/{language === 'vi' ? 'đêm' : 'night'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Tổng tiền' : 'Total Amount'}</p>
                      <p className="text-xl font-bold text-green-600">{selectedBooking.total_price.toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                  
                  {selectedBooking.price_breakdown.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">{language === 'vi' ? 'Chi tiết giá từng đêm:' : 'Price breakdown by night:'}</p>
                      <div className="space-y-1 text-sm">
                        {selectedBooking.price_breakdown.map((breakdown, index) => (
                          <div key={index} className="flex justify-between py-1 px-2 bg-gray-50 rounded">
                            <span>{breakdown}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.special_requests && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {language === 'vi' ? 'Yêu cầu đặc biệt' : 'Special Requests'}
                  </h3>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm">{selectedBooking.special_requests}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'confirmed');
                        setSelectedBooking(null);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {language === 'vi' ? 'Xác nhận' : 'Confirm'}
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'cancelled');
                        setSelectedBooking(null);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {language === 'vi' ? 'Từ chối' : 'Cancel'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BookingsManagement;