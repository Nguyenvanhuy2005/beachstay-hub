
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RoomManagement from './RoomManagement';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const RoomsManagement = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData?.session) {
          console.log('RoomsManagement: No active session found');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        const userEmail = sessionData.session.user.email;
        console.log('RoomsManagement: Checking admin status for', userEmail);
        
        if (!userEmail) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // Check if user email is in admin_users table
        try {
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle();
            
          if (error) {
            console.error('RoomsManagement: Error fetching admin data:', error);
            setIsAdmin(false);
          } else if (adminData) {
            console.log('RoomsManagement: Admin verified');
            setIsAdmin(true);
          } else {
            console.log('RoomsManagement: User is not an admin');
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('RoomsManagement: Error checking admin status:', error);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('RoomsManagement: Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  if (isLoading) {
    return (
      <Card className="border-olive-200">
        <CardHeader className="bg-olive-50">
          <CardTitle className="text-olive-800">Quản lý phòng</CardTitle>
          <CardDescription className="text-olive-600">
            Đang tải...
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-700"></div>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="border-olive-200">
        <CardHeader className="bg-olive-50">
          <CardTitle className="text-olive-800">Quản lý phòng</CardTitle>
          <CardDescription className="text-olive-600">
            Không có quyền truy cập
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-red-600">Bạn không có quyền truy cập vào tính năng này. Vui lòng đăng nhập với tài khoản quản trị.</p>
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
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-700"></div>
          </div>
        ) : !isAdmin ? (
          <p className="text-red-600">Bạn không có quyền truy cập vào tính năng này. Vui lòng đăng nhập với tài khoản quản trị.</p>
        ) : (
          <RoomManagement />
        )}
      </CardContent>
    </Card>
  );
};

export default RoomsManagement;
