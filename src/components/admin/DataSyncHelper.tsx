
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
import { Loader2, Download, Upload, Database, Copy, Code } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, syncGalleryImages, exportDatabaseContent } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DataSyncHelperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DataSyncHelper: React.FC<DataSyncHelperProps> = ({ open, onOpenChange }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sqlData, setSqlData] = useState('');
  const [selectedTable, setSelectedTable] = useState('gallery_images');
  const [sqlOutput, setSqlOutput] = useState('');
  const [setupSqlOutput, setSetupSqlOutput] = useState('');
  
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

  const handleGenerateSQL = () => {
    try {
      // Parse the JSON data
      const jsonData = JSON.parse(sqlData);
      
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error('Dữ liệu không đúng định dạng hoặc rỗng. Cần là một mảng các đối tượng.');
      }

      let sqlCreateTable = '';
      let sqlInserts = '';
      
      // Tạo câu lệnh tạo bảng dựa vào cấu trúc của object đầu tiên
      const firstItem = jsonData[0];
      const columns = Object.keys(firstItem);
      
      sqlCreateTable = `CREATE TABLE IF NOT EXISTS \`${selectedTable}\` (\n`;
      
      columns.forEach((column, index) => {
        let dataType = 'VARCHAR(255)';
        const value = firstItem[column];
        
        if (typeof value === 'number') {
          if (Number.isInteger(value)) {
            dataType = 'INT';
          } else {
            dataType = 'DECIMAL(10,2)';
          }
        } else if (typeof value === 'boolean') {
          dataType = 'TINYINT(1)';
        } else if (Array.isArray(value)) {
          dataType = 'TEXT';
        } else if (typeof value === 'object' && value !== null) {
          dataType = 'TEXT';
        } else if (typeof value === 'string') {
          if (value.length > 255) {
            dataType = 'TEXT';
          }
          // Kiểm tra nếu là date
          if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            dataType = 'TIMESTAMP';
          }
        }
        
        // Nếu là cột id, sử dụng VARCHAR(36)
        if (column === 'id') {
          dataType = 'VARCHAR(36)';
        }
        
        sqlCreateTable += `  \`${column}\` ${dataType}${column === 'id' ? ' PRIMARY KEY' : ''}${index < columns.length - 1 ? ',' : ''}\n`;
      });
      
      sqlCreateTable += ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n';
      
      // Tạo câu lệnh INSERT
      jsonData.forEach((item, itemIndex) => {
        sqlInserts += `INSERT INTO \`${selectedTable}\` (${columns.map(col => '`' + col + '`').join(', ')}) VALUES (\n`;
        
        columns.forEach((column, colIndex) => {
          const value = item[column];
          let formattedValue;
          
          if (value === null) {
            formattedValue = 'NULL';
          } else if (typeof value === 'string') {
            // Escape single quotes
            formattedValue = `'${value.replace(/'/g, "''")}'`;
          } else if (typeof value === 'boolean') {
            formattedValue = value ? '1' : '0';
          } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            // Convert arrays or objects to JSON strings
            formattedValue = `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          } else {
            formattedValue = value;
          }
          
          sqlInserts += `  ${formattedValue}${colIndex < columns.length - 1 ? ',' : ''}\n`;
        });
        
        sqlInserts += `);\n${itemIndex < jsonData.length - 1 ? '\n' : ''}`;
      });
      
      setSqlOutput(sqlCreateTable + sqlInserts);
      toast.success('Đã tạo SQL thành công');
      
    } catch (error) {
      console.error('Error generating SQL:', error);
      toast.error(`Lỗi tạo SQL: ${(error as any).message || 'Lỗi không xác định'}`);
      setSqlOutput('');
    }
  };

  const generateSetupSQL = () => {
    const sql = `-- Tạo bảng admin_users
CREATE TABLE \`admin_users\` (
  \`id\` varchar(36) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`is_active\` tinyint(1) DEFAULT 1,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Thêm admin mặc định
INSERT INTO \`admin_users\` (\`id\`, \`email\`, \`is_active\`) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@annamvillage.vn', 1);

-- Tạo bảng amenities
CREATE TABLE \`amenities\` (
  \`id\` varchar(36) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`name_en\` varchar(255) NOT NULL,
  \`icon\` varchar(255) NOT NULL,
  \`description\` text NOT NULL,
  \`description_en\` text NOT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng blog_posts
CREATE TABLE \`blog_posts\` (
  \`id\` varchar(36) NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`title_en\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`content\` text NOT NULL,
  \`content_en\` text NOT NULL,
  \`author\` varchar(255) NOT NULL,
  \`featured_image\` varchar(255) DEFAULT NULL,
  \`excerpt\` text DEFAULT NULL,
  \`excerpt_en\` text DEFAULT NULL,
  \`meta_title\` varchar(255) DEFAULT NULL,
  \`meta_title_en\` varchar(255) DEFAULT NULL,
  \`meta_description\` varchar(255) DEFAULT NULL,
  \`meta_description_en\` varchar(255) DEFAULT NULL,
  \`focus_keyword\` varchar(255) DEFAULT NULL,
  \`focus_keyword_en\` varchar(255) DEFAULT NULL,
  \`meta_keywords\` varchar(255) DEFAULT NULL,
  \`canonical_url\` varchar(255) DEFAULT NULL,
  \`structured_data\` text DEFAULT NULL,
  \`tags\` text DEFAULT NULL,
  \`published\` tinyint(1) DEFAULT 0,
  \`published_at\` timestamp NULL DEFAULT NULL,
  \`seo_score\` int(11) DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng gallery_images
CREATE TABLE \`gallery_images\` (
  \`id\` varchar(36) NOT NULL,
  \`src\` text NOT NULL,
  \`alt\` text NOT NULL,
  \`category\` text NOT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng room_types
CREATE TABLE \`room_types\` (
  \`id\` varchar(36) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`name_en\` varchar(255) NOT NULL,
  \`description\` text NOT NULL,
  \`description_en\` text NOT NULL,
  \`capacity\` varchar(255) NOT NULL,
  \`capacity_en\` varchar(255) NOT NULL,
  \`price\` decimal(10,2) NOT NULL,
  \`weekend_price\` decimal(10,2) DEFAULT NULL,
  \`is_popular\` tinyint(1) DEFAULT 0,
  \`image_url\` varchar(255) NOT NULL,
  \`gallery_images\` text DEFAULT NULL,
  \`amenities\` text NOT NULL,
  \`address\` text DEFAULT NULL,
  \`address_en\` text DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng bookings
CREATE TABLE \`bookings\` (
  \`id\` varchar(36) NOT NULL,
  \`room_type_id\` varchar(36) DEFAULT NULL,
  \`check_in\` date NOT NULL,
  \`check_out\` date NOT NULL,
  \`full_name\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`phone\` varchar(255) NOT NULL,
  \`adults\` int(11) NOT NULL DEFAULT 1,
  \`children\` int(11) NOT NULL DEFAULT 0,
  \`special_requests\` text DEFAULT NULL,
  \`status\` varchar(50) DEFAULT 'pending',
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng room_date_prices
CREATE TABLE \`room_date_prices\` (
  \`id\` varchar(36) NOT NULL,
  \`room_type_id\` varchar(36) NOT NULL,
  \`date\` date NOT NULL,
  \`price\` decimal(10,2) NOT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

    setSetupSqlOutput(sql);
    toast.success('Đã tạo SQL cài đặt thành công');
  };

  const handleCopyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast.success('Đã sao chép SQL vào clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Không thể sao chép vào clipboard');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đồng bộ dữ liệu</DialogTitle>
          <DialogDescription>
            Nhập hoặc xuất dữ liệu cho bảng đã chọn. Dữ liệu nhập phải ở định dạng JSON.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="import">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="import">Import vào Supabase</TabsTrigger>
            <TabsTrigger value="export">Export từ Supabase</TabsTrigger>
            <TabsTrigger value="sql">Tạo SQL từ JSON</TabsTrigger>
            <TabsTrigger value="setup">Cài đặt MySQL</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="table-select-import" className="flex-shrink-0 w-24">Chọn bảng</Label>
              <Select 
                value={selectedTable} 
                onValueChange={setSelectedTable}
              >
                <SelectTrigger id="table-select-import" className="flex-1">
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
              <Label htmlFor="import-data">Dữ liệu JSON (để nhập vào Supabase)</Label>
              <Textarea
                id="import-data"
                value={sqlData}
                onChange={(e) => setSqlData(e.target.value)}
                placeholder="Dán dữ liệu JSON cần nhập vào đây..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="flex justify-between">
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
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="table-select-export" className="flex-shrink-0 w-24">Chọn bảng</Label>
              <Select 
                value={selectedTable} 
                onValueChange={setSelectedTable}
              >
                <SelectTrigger id="table-select-export" className="flex-1">
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
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="default"
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
          </TabsContent>

          <TabsContent value="sql" className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="table-select-sql" className="flex-shrink-0 w-24">Chọn bảng</Label>
              <Select 
                value={selectedTable} 
                onValueChange={setSelectedTable}
              >
                <SelectTrigger id="table-select-sql" className="flex-1">
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
              <Label htmlFor="sql-json-input">Dữ liệu JSON (để tạo SQL)</Label>
              <Textarea
                id="sql-json-input"
                value={sqlData}
                onChange={(e) => setSqlData(e.target.value)}
                placeholder="Dán dữ liệu JSON cần chuyển đổi vào đây..."
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleGenerateSQL}
                disabled={!sqlData.trim()}
              >
                <Code className="mr-2 h-4 w-4" />
                Tạo SQL
              </Button>
            </div>

            {sqlOutput && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sql-output">SQL đã tạo</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyToClipboard(sqlOutput)}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Sao chép
                  </Button>
                </div>
                <Textarea
                  id="sql-output"
                  value={sqlOutput}
                  readOnly
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Sao chép SQL này và chạy trong phpMyAdmin để tạo bảng và nhập dữ liệu
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="setup-sql">SQL Cài đặt MySQL</Label>
                <div className="space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={generateSetupSQL}
                  >
                    <Database className="h-4 w-4 mr-1" /> Tạo SQL
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyToClipboard(setupSqlOutput)}
                    disabled={!setupSqlOutput}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Sao chép
                  </Button>
                </div>
              </div>
              <Textarea
                id="setup-sql"
                value={setupSqlOutput}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="Nhấn nút 'Tạo SQL' để tạo script cài đặt cơ sở dữ liệu MySQL..."
              />
              <p className="text-sm text-muted-foreground">
                Đây là script SQL để tạo tất cả các bảng cần thiết trong MySQL. Sao chép và chạy script này trong phpMyAdmin trước khi sử dụng website.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DataSyncHelper;
