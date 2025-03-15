
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, ShieldCheck } from 'lucide-react';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Đã đăng xuất');
    navigate('/admin');
  };

  return (
    <MainLayout>
      <div className="bg-beach-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <ShieldCheck className="h-6 w-6 mr-2 text-beach-700" />
              <h1 className="text-2xl font-bold text-beach-900">Trang Quản Trị Annam Village</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4 mr-1" /> Cài đặt
              </Button>
              <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:text-gray-900">
                <User className="h-4 w-4 mr-1" /> Admin
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm">
                <LogOut className="h-4 w-4 mr-1" /> Đăng xuất
              </Button>
            </div>
          </div>
          
          <AdminDashboard />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
