
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, FileDown, FileUp, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import AnimationWrapper from '@/components/utils/AnimationWrapper';

const RoomsManagement = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AnimationWrapper>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Quản lý phòng</CardTitle>
              <CardDescription>
                Quản lý danh sách phòng, thêm, sửa, xóa phòng
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                <FileDown className="h-4 w-4 mr-2" />
                Xuất
              </Button>
              <Button size="sm" variant="outline">
                <FileUp className="h-4 w-4 mr-2" />
                Nhập
              </Button>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Thêm phòng mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
                <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
                <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm phòng..." className="pl-8" />
                </div>
                <Button size="icon" variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="py-12 text-center">
                    <h3 className="text-lg font-medium mb-2">Tính năng đang được phát triển</h3>
                    <p className="text-muted-foreground mb-6">
                      Chức năng quản lý phòng sẽ sớm được cập nhật. Vui lòng quay lại sau.
                    </p>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Thêm phòng mới
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Nội dung các tab khác tương tự, có thể thêm sau */}
            <TabsContent value="active" className="mt-0">
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Không có phòng đang hoạt động</p>
              </div>
            </TabsContent>
            
            <TabsContent value="maintenance" className="mt-0">
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Không có phòng đang bảo trì</p>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-0">
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Không có phòng không hoạt động</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AnimationWrapper>
  );
};

export default RoomsManagement;
