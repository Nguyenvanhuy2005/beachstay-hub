
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, ShieldCheck, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Đã đăng xuất');
    navigate('/admin');
  };

  return (
    <MainLayout>
      <div className="bg-beach-50 min-h-screen py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <ShieldCheck className="h-7 w-7 mr-2 text-beach-700" />
              <h1 className="text-2xl font-bold text-beach-900">Trang Quản Trị Annam Village</h1>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                    <Bell className="h-5 w-5 text-beach-700" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-48 overflow-auto">
                    <DropdownMenuItem className="cursor-pointer">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium">Đơn đặt phòng mới</span>
                        <span className="text-sm text-muted-foreground">Nguyễn Văn A vừa đặt phòng</span>
                        <span className="text-xs text-muted-foreground">5 phút trước</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium">Liên hệ mới</span>
                        <span className="text-sm text-muted-foreground">Trần Thị B gửi yêu cầu liên hệ</span>
                        <span className="text-xs text-muted-foreground">1 giờ trước</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium">Cập nhật hệ thống</span>
                        <span className="text-sm text-muted-foreground">Hệ thống vừa được cập nhật lên phiên bản mới</span>
                        <span className="text-xs text-muted-foreground">2 giờ trước</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-center text-beach-600">
                    Xem tất cả thông báo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:text-gray-900">
                    <User className="h-4 w-4 mr-1" /> Admin
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" /> Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" /> Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <AdminDashboard />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
