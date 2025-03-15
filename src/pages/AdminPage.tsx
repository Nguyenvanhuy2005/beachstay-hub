
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the login page
    navigate('/admin/login');
  }, [navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto py-12 text-center">
        <p>Đang chuyển hướng...</p>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
