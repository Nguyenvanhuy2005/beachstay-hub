
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import RoomManagement from './RoomManagement';
import ContentManagement from './ContentManagement';
import { HotelIcon, BookOpenTextIcon, CalendarRangeIcon, LayoutDashboardIcon } from 'lucide-react';
import { getBookingsByStatus, updateBookingStatus } from '@/api/bookingApi';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRooms: 0,
    totalPosts: 0
  });

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get room count
      const { data: rooms, error: roomsError } = await supabase
        .from('room_types')
        .select('id');
      
      if (roomsError) throw roomsError;

      // Get post count
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id');
      
      if (postsError) throw postsError;

      // Get booking counts
      const { data: allBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('status');
      
      if (bookingsError) throw bookingsError;

      const pending = allBookings?.filter(b => b.status === 'pending').length || 0;
      const confirmed = allBookings?.filter(b => b.status === 'confirmed').length || 0;

      setStats({
        totalBookings: allBookings?.length || 0,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        totalRooms: rooms?.length || 0,
        totalPosts: posts?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching bookings...');
      const bookingsData = await getBookingsByStatus();
      console.log('Bookings fetched:', bookingsData?.length || 0);
      
      // Fetch room type details for each booking
      const enhancedBookings = await Promise.all(bookingsData.map(async (booking) => {
        if (booking.room_type_id) {
          const { data: roomTypeData } = await supabase
            .from('room_types')
            .select('name, name_en')
            .eq('id', booking.room_type_id)
            .single();
          
          return {
            ...booking,
            room_type_name: roomTypeData?.name || 'Unknown',
            room_type_name_en: roomTypeData?.name_en || 'Unknown'
          };
        }
        return booking;
      }));
      
      setBookings(enhancedBookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Không thể tải dữ liệu đặt phòng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      console.log(`Updating booking ${id} to status: ${status}`);
      const result = await updateBookingStatus(id, status);
      
      if (result.success) {
        toast.success(`Đã cập nhật trạng thái đặt phòng thành "${status}"`);
        fetchBookings();
        fetchStats();
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Không thể cập nhật trạng thái đặt phòng');
    }
  };

  const renderBookingStatus = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Đã xác nhận</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Đã hủy</span>;
      case 'pending':
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Đang chờ</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng đặt phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarRangeIcon className="h-6 w-6 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang chờ xác nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarRangeIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <HotelIcon className="h-6 w-6 text-green-500 mr-2" />
              <div className="text-2xl font-bold">{stats.totalRooms}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpenTextIcon className="h-6 w-6 text-purple-500 mr-2" />
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LayoutDashboardIcon className="mr-2 h-6 w-6" /> 
            Quản Lý Annam Village
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="bookings" className="flex items-center justify-center">
                <CalendarRangeIcon className="mr-2 h-4 w-4" /> Đặt Phòng
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex items-center justify-center">
                <HotelIcon className="mr-2 h-4 w-4" /> Phòng
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center justify-center">
                <BookOpenTextIcon className="mr-2 h-4 w-4" /> Nội Dung
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Danh Sách Đặt Phòng</h3>
                <Button onClick={fetchBookings} variant="outline" size="sm">
                  Làm mới
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Đang tải...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-muted/40 rounded-md">
                  <h3 className="text-lg font-medium">Chưa có đặt phòng nào</h3>
                  <p className="text-muted-foreground">Các đặt phòng mới sẽ xuất hiện ở đây</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 border">Tên khách</th>
                        <th className="text-left p-3 border">Liên hệ</th>
                        <th className="text-left p-3 border">Ngày đến</th>
                        <th className="text-left p-3 border">Ngày đi</th>
                        <th className="text-left p-3 border">Loại phòng</th>
                        <th className="text-left p-3 border">Trạng thái</th>
                        <th className="text-left p-3 border">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-t hover:bg-muted/30">
                          <td className="p-3 border">{booking.full_name}</td>
                          <td className="p-3 border">
                            <div>{booking.email}</div>
                            <div>{booking.phone}</div>
                          </td>
                          <td className="p-3 border">{formatDate(booking.check_in)}</td>
                          <td className="p-3 border">{formatDate(booking.check_out)}</td>
                          <td className="p-3 border">{booking.room_type_name || 'Unknown'}</td>
                          <td className="p-3 border">{renderBookingStatus(booking.status)}</td>
                          <td className="p-3 border">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                disabled={booking.status === 'confirmed'}
                              >
                                Xác nhận
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                disabled={booking.status === 'cancelled'}
                                className="text-red-500"
                              >
                                Hủy
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rooms" className="space-y-4">
              <RoomManagement />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <ContentManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
