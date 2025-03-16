
// Kết nối với MySQL API thay vì Supabase
import { mysqlDb, uploadFile, getPublicUrl } from './mysql-db';

// Giả lập đối tượng supabase cho khả năng tương thích ngược
export const supabase = {
  from: (tableName: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => mysqlDb.select(tableName, { columns, eq: [column, value], limit: 1 }),
        limit: (limit: number) => ({
          order: (column: string, { ascending = true } = {}) => 
            mysqlDb.select(tableName, { columns, eq: [column, value], limit, order: { column, ascending } }),
        }),
        order: (column: string, { ascending = true } = {}) => 
          mysqlDb.select(tableName, { columns, eq: [column, value], order: { column, ascending } }),
      }),
      neq: (column: string, value: any) => ({
        // Không hỗ trợ neq trực tiếp, cần cài đặt API riêng
        single: () => Promise.resolve({ data: null, error: new Error('Not implemented') }),
      }),
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => 
          mysqlDb.select(tableName, { columns, order: { column, ascending }, limit }),
      }),
      limit: (limit: number) => 
        mysqlDb.select(tableName, { columns, limit }),
    }),
    insert: (data: any) => ({
      select: () => mysqlDb.insert(tableName, data),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => 
        mysqlDb.update(tableName, data, { column, value }),
      match: (criteria: Record<string, any>) => {
        // Chỉ hỗ trợ match với một tiêu chí
        const [column, value] = Object.entries(criteria)[0];
        return mysqlDb.update(tableName, data, { column, value });
      },
    }),
    delete: () => ({
      eq: (column: string, value: any) => 
        mysqlDb.delete(tableName, { column, value }),
      match: (criteria: Record<string, any>) => {
        // Chỉ hỗ trợ match với một tiêu chí
        const [column, value] = Object.entries(criteria)[0];
        return mysqlDb.delete(tableName, { column, value });
      },
    }),
  }),
  storage: {
    from: (bucketName: string) => ({
      upload: (path: string, file: File) => uploadFile(file, `${bucketName}/${path}`),
      getPublicUrl: (path: string) => ({ data: { publicUrl: getPublicUrl(bucketName, path) } }),
      remove: (paths: string[]) => {
        // Giả lập xóa file - cần cài đặt API riêng
        console.log('Remove files:', paths);
        return Promise.resolve({ data: null, error: null });
      },
    }),
  },
};

// Export các hàm trợ giúp
export { getPublicUrl };

// Hàm đồng bộ hình ảnh thư viện
export const syncGalleryImages = async (images: any[]) => {
  // Giả lập đồng bộ hình ảnh
  console.log('Synchronizing gallery images:', images.length);
  
  try {
    // Xóa tất cả hình ảnh hiện tại
    await fetch('/api/db/gallery_images/clear', { method: 'POST' });
    
    // Thêm các hình ảnh mới
    const response = await fetch('/api/db/gallery_images/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(images),
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync gallery images');
    }
    
    return { data: await response.json(), error: null };
  } catch (error) {
    console.error('Error syncing gallery images:', error);
    return { data: null, error };
  }
};

// Hàm xuất nội dung cơ sở dữ liệu
export const exportDatabaseContent = async (tableName: string) => {
  try {
    const response = await fetch(`/api/db/${tableName}/export`);
    
    if (!response.ok) {
      throw new Error(`Failed to export ${tableName}`);
    }
    
    const data = await response.json();
    
    // Tạo file JSON để tải xuống
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Tạo link ẩn và kích hoạt tải xuống
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tableName}_export_${new Date().toISOString().replace(/:/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error(`Error exporting ${tableName}:`, error);
    throw error;
  }
};
