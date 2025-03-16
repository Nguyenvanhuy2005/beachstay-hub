
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const RoomsManagement = () => {
  const { language } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'vi' ? 'Quản lý phòng' : 'Room Management'}
        </CardTitle>
        <CardDescription>
          {language === 'vi' 
            ? 'Quản lý danh sách phòng, thêm, sửa, xóa phòng' 
            : 'Manage room list, add, edit, delete rooms'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {language === 'vi' 
            ? 'Tính năng này đang được phát triển.' 
            : 'This feature is under development.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default RoomsManagement;
