
// Thư viện kết nối MySQL cho cPanel

// Các phương thức để tương tác với database MySQL trên cPanel

interface DbResponse<T = any> {
  data: T | null;
  error: Error | null;
}

// Giả lập kết nối API đến MySQL trên cPanel
export const mysqlDb = {
  // Phương thức select để lấy dữ liệu từ bảng
  async select<T = any>(tableName: string, options: { 
    columns?: string, 
    eq?: [string, any], 
    limit?: number,
    order?: { column: string, ascending: boolean }
  } = {}): Promise<DbResponse<T[]>> {
    try {
      // Xây dựng URL API
      let url = `/api/db/${tableName}`;
      
      const params = new URLSearchParams();
      
      if (options.columns) {
        params.append('columns', options.columns);
      }
      
      if (options.eq) {
        params.append('filter_column', options.eq[0]);
        params.append('filter_value', options.eq[1]);
      }
      
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      
      if (options.order) {
        params.append('order_column', options.order.column);
        params.append('order_direction', options.order.ascending ? 'asc' : 'desc');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      console.error('Database select error:', error);
      return { data: null, error: error as Error };
    }
  },
  
  // Phương thức insert để thêm dữ liệu vào bảng
  async insert<T = any>(tableName: string, data: any): Promise<DbResponse<T>> {
    try {
      const response = await fetch(`/api/db/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      console.error('Database insert error:', error);
      return { data: null, error: error as Error };
    }
  },
  
  // Phương thức update để cập nhật dữ liệu
  async update<T = any>(tableName: string, data: any, condition: { column: string, value: any }): Promise<DbResponse<T>> {
    try {
      const response = await fetch(`/api/db/${tableName}?${condition.column}=${condition.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      console.error('Database update error:', error);
      return { data: null, error: error as Error };
    }
  },
  
  // Phương thức delete để xóa dữ liệu
  async delete(tableName: string, condition: { column: string, value: any }): Promise<DbResponse> {
    try {
      const response = await fetch(`/api/db/${tableName}?${condition.column}=${condition.value}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Database delete error:', error);
      return { data: null, error: error as Error };
    }
  }
};

// Phương thức để tải lên file
export const uploadFile = async (file: File, folder: string): Promise<{ url: string | null, error: Error | null }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return { url: result.url, error: null };
  } catch (error) {
    console.error('File upload error:', error);
    return { url: null, error: error as Error };
  }
};

// Phương thức để lấy URL công khai của file
export const getPublicUrl = (bucketName: string, path: string): string => {
  // Với cPanel, đường dẫn công khai thường là domain/path
  return `/uploads/${path}`;
};

// Export các tính năng bổ sung
export const DatabaseAdapter = {
  mysqlDb,
  uploadFile,
  getPublicUrl,
};
