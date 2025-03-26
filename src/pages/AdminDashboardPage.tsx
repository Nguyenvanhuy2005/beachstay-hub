
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Bell, Home, Key, ShieldCheck, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Đã đăng xuất');
    navigate('/admin');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        setPasswordError(error.message);
        return;
      }
      
      toast.success('Đổi mật khẩu thành công');
      setIsPasswordDialogOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Lỗi đổi mật khẩu:', error);
      setPasswordError(error.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-beach-50 min-h-screen">
        {/* Admin header */}
        <header className="bg-white border-b border-gray-200 shadow-sm py-3">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2 text-beach-700" />
              <h1 className="text-xl font-bold text-beach-900">Annam Village Admin</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/" className="text-beach-700 hover:text-beach-900 flex items-center gap-1">
                <Home size={18} />
                <span className="hidden sm:inline">Trang chủ</span>
              </Link>
              
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
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Settings className="h-4 w-4 mr-2" /> Cài đặt
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Đổi mật khẩu</DialogTitle>
                        <DialogDescription>
                          Cập nhật mật khẩu mới cho tài khoản của bạn
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleChangePassword}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-password" className="text-right">
                              Mật khẩu mới
                            </Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="col-span-3"
                              required
                              minLength={6}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirm-password" className="text-right">
                              Xác nhận
                            </Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="col-span-3"
                              required
                            />
                          </div>
                          {passwordError && (
                            <div className="col-span-4 text-sm text-red-500">
                              {passwordError}
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? "Đang xử lý..." : "Lưu thay đổi"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-6">
          <AdminDashboard />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
