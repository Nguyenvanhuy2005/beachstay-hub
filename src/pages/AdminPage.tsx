
import React from 'react';
import { supabase } from '@/lib/supabase';
import AdminLoginPage from './AdminLoginPage';

// Đơn giản hóa AdminPage bằng cách trả về trực tiếp trang đăng nhập
const AdminPage = () => {
  return <AdminLoginPage />;
};

export default AdminPage;
