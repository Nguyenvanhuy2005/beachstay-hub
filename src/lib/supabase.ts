
// Kết nối với MySQL API thay vì Supabase
import { 
  mysqlDb, 
  uploadFile, 
  getPublicUrl, 
  checkRoomAvailability, 
  getBookingsWithRoomInfo, 
  getBookedDatesForRoomType,
  DatabaseAdapter
} from './mysql-db';

// Bổ sung interface cho rpc
interface RpcFunction {
  (functionName: string, params: any): Promise<{ data: any | null, error: Error | null }>;
}

// Giả lập đối tượng supabase cho khả năng tương thích ngược
export const supabase = {
  from: (tableName: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => mysqlDb.select(tableName, { columns, eq: [column, value], limit: 1 }),
        maybeSingle: () => mysqlDb.select(tableName, { columns, eq: [column, value], limit: 1 }),
        limit: (limit: number) => ({
          order: (column: string, { ascending = true } = {}) => 
            mysqlDb.select(tableName, { columns, eq: [column, value], limit, order: { column, ascending } }),
          data: null,
          error: null
        }),
        order: (column: string, { ascending = true } = {}) => 
          mysqlDb.select(tableName, { columns, eq: [column, value], order: { column, ascending } }),
        in: (column: string, values: any[]) => ({
          limit: (limit: number) => 
            Promise.resolve({ data: [], error: new Error('Not implemented') }),
        }),
      }),
      neq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: new Error('Not implemented') }),
        maybeSingle: () => Promise.resolve({ data: null, error: new Error('Not implemented') }),
      }),
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => 
          mysqlDb.select(tableName, { columns, order: { column, ascending }, limit }),
        data: null,
        error: null
      }),
      limit: (limit: number) => ({
        ...mysqlDb.select(tableName, { columns, limit }),
        data: null,
        error: null
      }),
      in: (column: string, values: any[]) => ({
        limit: (limit: number) => 
          Promise.resolve({ data: [], error: new Error('Not implemented') }),
      }),
    }),
    insert: (data: any) => ({
      select: () => mysqlDb.insert(tableName, data),
      data: null,
      error: null
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => 
        mysqlDb.update(tableName, data, { column, value }),
      match: (criteria: Record<string, any>) => {
        // Chỉ hỗ trợ match với một tiêu chí
        const [column, value] = Object.entries(criteria)[0];
        return mysqlDb.update(tableName, data, { column, value });
      },
      neq: (column: string, value: any) => 
        Promise.resolve({ data: null, error: new Error('Not implemented') }),
      data: null,
      error: null
    }),
    delete: () => ({
      eq: (column: string, value: any) => 
        mysqlDb.delete(tableName, { column, value }),
      match: (criteria: Record<string, any>) => {
        // Chỉ hỗ trợ match với một tiêu chí
        const [column, value] = Object.entries(criteria)[0];
        return mysqlDb.delete(tableName, { column, value });
      },
      neq: (column: string, value: any) => 
        Promise.resolve({ data: null, error: new Error('Not implemented') }),
      data: null,
      error: null
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
  auth: DatabaseAdapter.auth,
  rpc: ((functionName: string, params: any) => mysqlDb.rpc(functionName, params)) as RpcFunction,
  functions: {
    invoke: (functionName: string, options?: { body?: any }) => {
      return new Promise((resolve) => {
        // Giả lập các chức năng edge function
        console.log(`Invoke function ${functionName} with data:`, options?.body);
        
        if (functionName === 'send-booking-notification') {
          // Giả lập gửi email
          setTimeout(() => {
            resolve({
              data: { success: true, message: 'Email sent successfully' },
              error: null
            });
          }, 500);
        } else if (functionName === 'create-image-bucket') {
          // Giả lập tạo bucket
          setTimeout(() => {
            resolve({
              data: { success: true },
              error: null
            });
          }, 300);
        } else {
          resolve({
            data: null,
            error: { message: 'Function not implemented', statusCode: 501 }
          });
        }
      });
    }
  }
};

// Export các hàm trợ giúp
export { 
  getPublicUrl, 
  checkRoomAvailability, 
  getBookingsWithRoomInfo,
  getBookedDatesForRoomType
};

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
