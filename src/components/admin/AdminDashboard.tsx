import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Không thể tải dữ liệu đặt phòng');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success(`Đã cập nhật trạng thái đặt phòng thành "${status}"`);
      fetchBookings();
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
      <Card>
        <CardHeader>
          <CardTitle>Quản Lý Annam Village</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bookings">
            <TabsList>
              <TabsTrigger value="bookings">Đặt Phòng</TabsTrigger>
              <TabsTrigger value="rooms">Phòng</TabsTrigger>
              <TabsTrigger value="content">Nội Dung</TabsTrigger>
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
                <div className="text-center py-4">Chưa có đặt phòng nào</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-2 border">Tên khách</th>
                        <th className="text-left p-2 border">Liên hệ</th>
                        <th className="text-left p-2 border">Ngày đến</th>
                        <th className="text-left p-2 border">Ngày đi</th>
                        <th className="text-left p-2 border">Loại phòng</th>
                        <th className="text-left p-2 border">Trạng thái</th>
                        <th className="text-left p-2 border">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-t hover:bg-gray-50">
                          <td className="p-2 border">{booking.full_name}</td>
                          <td className="p-2 border">
                            <div>{booking.email}</div>
                            <div>{booking.phone}</div>
                          </td>
                          <td className="p-2 border">{formatDate(booking.check_in)}</td>
                          <td className="p-2 border">{formatDate(booking.check_out)}</td>
                          <td className="p-2 border">{booking.room_type}</td>
                          <td className="p-2 border">{renderBookingStatus(booking.status)}</td>
                          <td className="p-2 border">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                disabled={booking.status === 'confirmed'}
                              >
                                Xác nhận
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
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
              <div className="text-center py-4">
                <p>Tính năng quản lý phòng sẽ được phát triển trong tương lai</p>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="text-center py-4">
                <p>Tính năng quản lý nội dung sẽ được phát triển trong tương lai</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
