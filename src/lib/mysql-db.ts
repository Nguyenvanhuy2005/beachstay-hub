
// Thư viện kết nối MySQL cho cPanel

// Định nghĩa interface cho response
export interface DbResponse<T = any> {
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
  },

  // Phương thức rpc để gọi hàm (MySQL procedure or function)
  async rpc<T = any>(functionName: string, params: any): Promise<DbResponse<T>> {
    try {
      const response = await fetch(`/api/db/rpc/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      console.error(`RPC error for ${functionName}:`, error);
      return { data: null, error: error as Error };
    }
  },
  
  // Phương thức functions để tương thích với Supabase
  functions: {
    invoke(functionName: string, options: { body?: any } = {}): Promise<{ data: any, error: Error | null }> {
      try {
        // Giả lập edge functions dưới dạng API endpoint
        return Promise.resolve({ data: {}, error: null });
      } catch (error) {
        return Promise.resolve({ data: null, error: error as Error });
      }
    }
  }
};

// Phương thức để tải lên file
export const uploadFile = async (file: File, path: string): Promise<{ url: string, error: Error }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', path.split('/')[0]); // Lấy bucket name làm folder
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return { 
      url: result.url,
      error: null as unknown as Error 
    };
  } catch (error) {
    console.error('File upload error:', error);
    return { url: '', error: error as Error };
  }
};

// Phương thức để lấy URL công khai của file
export const getPublicUrl = (bucketName: string, path: string): string => {
  // Với cPanel, đường dẫn công khai thường là domain/path
  return `/uploads/${bucketName}/${path}`;
};

// Hàm kiểm tra phòng có khả dụng hay không
export const checkRoomAvailability = async (roomTypeId: string, checkIn: string, checkOut: string): Promise<{available: boolean, remainingRooms: number}> => {
  try {
    const response = await fetch(`/api/db/room_availability?room_type_id=${roomTypeId}&check_in=${checkIn}&check_out=${checkOut}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking room availability:', error);
    return { available: false, remainingRooms: 0 };
  }
};

// Hàm lấy thông tin đặt phòng cùng chi tiết phòng
export const getBookingsWithRoomInfo = async (status?: string) => {
  try {
    let url = '/api/db/bookings_with_room_info';
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings with room info:', error);
    return [];
  }
};

// Hàm lấy ngày đã đặt cho loại phòng
export const getBookedDatesForRoomType = async (roomTypeId: string) => {
  try {
    const response = await fetch(`/api/db/booked_dates?room_type_id=${roomTypeId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return [];
  }
};

// Interface cho đối tượng auth - giả lập
export interface AuthSession {
  user: {
    id: string;
    email: string;
  } | null;
}

export interface AuthResult {
  data: {
    session?: AuthSession | null;
    user?: any;
  };
  error: Error | null;
}

export interface AuthInterface {
  getSession(): Promise<AuthResult>;
  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void): { 
    data?: AuthSession | null;
    subscription: { unsubscribe: () => void } 
  };
  signInWithPassword(credentials: { email: string; password: string }): Promise<AuthResult>;
  signOut(): Promise<{ error: Error | null }>;
  resetPasswordForEmail(email: string, options?: { redirectTo: string }): Promise<{ error: Error | null }>;
}

// Tạo đối tượng xác thực giả lập
const createAuthInterface = (): AuthInterface => {
  let currentSession: AuthSession | null = null;
  const listeners: ((event: string, session: AuthSession | null) => void)[] = [];

  // Lấy session từ localStorage nếu có
  const initSession = () => {
    try {
      const storedSession = localStorage.getItem('auth.session');
      if (storedSession) {
        currentSession = JSON.parse(storedSession);
      }
    } catch (e) {
      console.error('Error loading auth session:', e);
    }
  };

  // Lưu session vào localStorage
  const saveSession = (session: AuthSession | null) => {
    try {
      if (session) {
        localStorage.setItem('auth.session', JSON.stringify(session));
      } else {
        localStorage.removeItem('auth.session');
      }
    } catch (e) {
      console.error('Error saving auth session:', e);
    }
  };

  // Thông báo cho tất cả listeners về sự thay đổi
  const notifyListeners = (event: string) => {
    listeners.forEach(listener => listener(event, currentSession));
  };

  // Thiết lập session ban đầu
  initSession();

  return {
    async getSession(): Promise<AuthResult> {
      return {
        data: { session: currentSession },
        error: null
      };
    },
    
    onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
      listeners.push(callback);
      // Gọi callback ngay lập tức với trạng thái hiện tại
      callback(currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', currentSession);
      
      return {
        data: currentSession,
        subscription: {
          unsubscribe: () => {
            const index = listeners.indexOf(callback);
            if (index !== -1) {
              listeners.splice(index, 1);
            }
          }
        }
      };
    },
    
    async signInWithPassword({ email, password }: { email: string; password: string }): Promise<AuthResult> {
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          return { data: {}, error: new Error(errorData.message || 'Invalid login credentials') };
        }
        
        const data = await response.json();
        currentSession = { user: { id: data.user_id, email } };
        saveSession(currentSession);
        notifyListeners('SIGNED_IN');
        
        return { data: { session: currentSession, user: { id: data.user_id, email } }, error: null };
      } catch (error) {
        return { data: {}, error: error as Error };
      }
    },
    
    async signOut(): Promise<{ error: Error | null }> {
      try {
        await fetch('/api/auth/signout', { method: 'POST' });
        currentSession = null;
        saveSession(null);
        notifyListeners('SIGNED_OUT');
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    
    async resetPasswordForEmail(email: string, options?: { redirectTo: string }): Promise<{ error: Error | null }> {
      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, redirect_to: options?.redirectTo }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          return { error: new Error(errorData.message || 'Failed to reset password') };
        }
        
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    }
  };
};

// Export các tính năng bổ sung
export const DatabaseAdapter = {
  mysqlDb,
  uploadFile,
  getPublicUrl,
  checkRoomAvailability,
  getBookingsWithRoomInfo,
  getBookedDatesForRoomType,
  auth: createAuthInterface()
};
