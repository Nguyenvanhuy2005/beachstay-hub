
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Upload, Database } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, syncGalleryImages, exportDatabaseContent } from '@/lib/supabase';

interface DataSyncHelperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DataSyncHelper: React.FC<DataSyncHelperProps> = ({ open, onOpenChange }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sqlData, setSqlData] = useState('');
  const [selectedTable, setSelectedTable] = useState('gallery_images');
  
  const tables = [
    { id: 'gallery_images', name: 'Gallery Images' },
    { id: 'room_types', name: 'Room Types' },
    { id: 'bookings', name: 'Bookings' },
    { id: 'blog_posts', name: 'Blog Posts' }
  ];
  
  const handleImport = async () => {
    if (!sqlData.trim()) {
      toast.error('Vui lòng nhập dữ liệu để nhập');
      return;
    }
    
    setImporting(true);
    
    try {
      // Parse the JSON data
      const jsonData = JSON.parse(sqlData);
      
      if (!Array.isArray(jsonData)) {
        throw new Error('Dữ liệu không đúng định dạng. Cần là một mảng các đối tượng.');
      }
      
      let result;
      
      // Handle different tables
      switch (selectedTable) {
        case 'gallery_images':
          result = await syncGalleryImages(jsonData);
          break;
        case 'room_types':
          // First clear existing data
          await supabase.from('room_types').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          result = await supabase.from('room_types').insert(jsonData).select();
          break;
        case 'bookings':
          // First clear existing data
          await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          result = await supabase.from('bookings').insert(jsonData).select();
          break;
        case 'blog_posts':
          // First clear existing data
          await supabase.from('blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          result = await supabase.from('blog_posts').insert(jsonData).select();
          break;
        default:
          throw new Error('Bảng không được hỗ trợ');
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success(`Đã nhập thành công ${jsonData.length} bản ghi vào bảng ${selectedTable}`);
      setSqlData('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error(`Lỗi nhập dữ liệu: ${(error as any).message || 'Lỗi không xác định'}`);
    } finally {
      setImporting(false);
    }
  };
  
  const handleExport = async () => {
    setExporting(true);
    
    try {
      await exportDatabaseContent(selectedTable);
      toast.success(`Đã xuất dữ liệu từ bảng ${selectedTable}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error(`Lỗi xuất dữ liệu: ${(error as any).message || 'Lỗi không xác định'}`);
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Đồng bộ dữ liệu</DialogTitle>
          <DialogDescription>
            Nhập hoặc xuất dữ liệu cho bảng đã chọn. Dữ liệu nhập phải ở định dạng JSON.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="table-select" className="flex-shrink-0 w-24">Chọn bảng</Label>
            <Select 
              value={selectedTable} 
              onValueChange={setSelectedTable}
            >
              <SelectTrigger id="table-select" className="flex-1">
                <SelectValue placeholder="Chọn bảng dữ liệu" />
              </SelectTrigger>
              <SelectContent>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sql-data">Dữ liệu JSON (để nhập)</Label>
            <Textarea
              id="sql-data"
              value={sqlData}
              onChange={(e) => setSqlData(e.target.value)}
              placeholder="Dán dữ liệu JSON cần nhập vào đây..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất dữ liệu
                </>
              )}
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={importing}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleImport}
              disabled={importing || !sqlData.trim()}
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang nhập...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Nhập dữ liệu
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataSyncHelper;
