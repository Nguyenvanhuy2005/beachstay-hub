
// Kết nối tới MySQL thông qua adapter thay vì Supabase
import { mysqlDb, uploadFile, getPublicUrl, checkRoomAvailability, getBookingsWithRoomInfo, getBookedDatesForRoomType, DatabaseAdapter } from './mysql-db';

// Tạo đối tượng supabase giả lập để sử dụng với MySQL
export const supabase = {
  from: (tableName: string) => {
    // Tạo đối tượng truy vấn
    return {
      select: (columns?: string) => {
        // Truy vấn select
        return {
          eq: (column: string, value: any) => {
            // Lọc dữ liệu bằng điều kiện
            return {
              single: () => mysqlDb.select(tableName, { columns, eq: [column, value] }),
              maybeSingle: () => mysqlDb.select(tableName, { columns, eq: [column, value] }),
              limit: (limit: number) => ({
                order: (orderColumn: string, { ascending }: { ascending?: boolean } = {}) => 
                  mysqlDb.select(tableName, { 
                    columns, 
                    eq: [column, value], 
                    limit, 
                    order: { column: orderColumn, ascending: ascending !== false } 
                  }),
                data: null,
                error: null
              }),
              order: (orderColumn: string, { ascending }: { ascending?: boolean } = {}) => 
                mysqlDb.select(tableName, { 
                  columns, 
                  eq: [column, value], 
                  order: { column: orderColumn, ascending: ascending !== false } 
                }),
              in: (inColumn: string, values: any[]) => ({
                order: (orderColumn: string, { ascending }: { ascending?: boolean } = {}) => 
                  mysqlDb.select(tableName, { 
                    columns, 
                    eq: [column, value], 
                    order: { column: orderColumn, ascending: ascending !== false } 
                  }),
                data: null,
                error: null
              }),
              neq: (neqColumn: string, neqValue: any) => ({
                order: (orderColumn: string, { ascending }: { ascending?: boolean } = {}) => 
                  mysqlDb.select(tableName, { 
                    columns, 
                    eq: [column, value], 
                    order: { column: orderColumn, ascending: ascending !== false } 
                  }),
                data: null,
                error: null
              })
            };
          },
          neq: (column: string, value: any) => {
            // Tương tự với eq nhưng là không bằng
            // Đây là phiên bản đơn giản, cần cải thiện trong triển khai thực tế
            return {
              order: (orderColumn: string, { ascending }: { ascending?: boolean } = {}) => 
                mysqlDb.select(tableName, { 
                  columns, 
                  order: { column: orderColumn, ascending: ascending !== false } 
                })
            };
          },
          order: (column: string, { ascending }: { ascending?: boolean } = {}) => {
            return mysqlDb.select(tableName, { 
              columns, 
              order: { column, ascending: ascending !== false } 
            });
          },
          limit: (limit: number) => {
            return mysqlDb.select(tableName, { columns, limit });
          },
          in: (column: string, values: any[]) => {
            // Đây chỉ là đơn giản hóa, cần cải thiện để xử lý IN trong SQL
            return {
              order: (orderColumn: string, { ascending }: { ascending?: boolean } = {}) => 
                mysqlDb.select(tableName, { 
                  columns, 
                  order: { column: orderColumn, ascending: ascending !== false } 
                }),
              data: null,
              error: null
            };
          }
        };
      },
      insert: (data: any) => {
        return mysqlDb.insert(tableName, data);
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            return mysqlDb.update(tableName, data, { column, value });
          },
          match: (criteria: Record<string, any>) => {
            // Giả lập match với điều kiện đầu tiên
            const column = Object.keys(criteria)[0];
            const value = criteria[column];
            return mysqlDb.update(tableName, data, { column, value });
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return mysqlDb.delete(tableName, { column, value });
          },
          match: (criteria: Record<string, any>) => {
            // Giả lập match với điều kiện đầu tiên
            const column = Object.keys(criteria)[0];
            const value = criteria[column];
            return mysqlDb.delete(tableName, { column, value });
          }
        };
      }
    };
  },
  // Thêm hàm functions cho tương thích
  functions: DatabaseAdapter.mysqlDb.functions,
  // Thêm hàm auth cho xác thực
  auth: DatabaseAdapter.auth
};

// Các hàm tiện ích cho storage
export const storage = {
  uploadFile,
  getPublicUrl
};

// Các hàm tiện ích cho booking
export { 
  checkRoomAvailability,
  getBookingsWithRoomInfo,
  getBookedDatesForRoomType
};

// Hàm đồng bộ ảnh
export const syncGalleryImages = async (images: any[]) => {
  // Xóa tất cả ảnh gallery hiện tại
  try {
    await mysqlDb.delete('gallery_images', { column: 'id', value: 'all' });
    
    // Thêm ảnh mới
    for (const image of images) {
      await mysqlDb.insert('gallery_images', image);
    }
    
    return { data: images, error: null };
  } catch (error) {
    console.error('Error syncing gallery images:', error);
    return { data: null, error: error as Error };
  }
};

// Hàm xuất dữ liệu
export const exportDatabaseContent = async (tableName: string) => {
  try {
    const { data, error } = await mysqlDb.select(tableName);
    
    if (error) {
      throw error;
    }
    
    // Tạo file JSON và download
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}_export_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error exporting ${tableName}:`, error);
    throw error;
  }
};
