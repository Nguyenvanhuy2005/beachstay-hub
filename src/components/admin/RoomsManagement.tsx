
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RoomsManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý phòng</CardTitle>
        <CardDescription>
          Quản lý danh sách phòng, thêm, sửa, xóa phòng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Tính năng này đang được phát triển.
        </p>
      </CardContent>
    </Card>
  );
};

export default RoomsManagement;
