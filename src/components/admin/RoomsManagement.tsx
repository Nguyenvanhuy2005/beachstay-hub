
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RoomsManagement = () => {
  return (
    <Card className="border-olive-200">
      <CardHeader className="bg-olive-50">
        <CardTitle className="text-olive-800">Quản lý phòng</CardTitle>
        <CardDescription className="text-olive-600">
          Quản lý danh sách phòng, thêm, sửa, xóa phòng
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-terra-600">
          Tính năng này đang được phát triển.
        </p>
      </CardContent>
    </Card>
  );
};

export default RoomsManagement;
