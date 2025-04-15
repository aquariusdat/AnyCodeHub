import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginResponse } from '@/types/auth';
import { apiService } from '@/services/api.service';
import Cookies from 'js-cookie';

// Tên cookie cho thông tin người dùng
const USER_COOKIE_NAME = 'user_data';

// Định nghĩa interface cho state của auth store
interface AuthState {
  // Dữ liệu state
  user: User | null;
  
  // Getter
  isAuthenticated: () => boolean;
  
  // Actions
  setAuth: (loginResponse: LoginResponse) => Promise<void>;
  updateUserInfo: (user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  getUser: () => User | null;
}

// Tạo store với zustand và middleware persist để lưu trạng thái
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State mặc định
      user: null,
      
      // Getter function
      isAuthenticated: () => !!get().user,
      
      // Action để set thông tin auth khi đăng nhập
      setAuth: async (loginResponse: LoginResponse) => {
        const user = loginResponse.value.userInformation;
        
        // Lưu thông tin user vào cookie cho UI
        Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), {
          expires: 7, // 7 ngày
          path: '/',
          sameSite: 'strict'
        });
        
        // Cập nhật state
        set({ user });
      },
      
      // Action để cập nhật thông tin người dùng
      updateUserInfo: async (user: User) => {
        // Lưu thông tin user vào cookie
        Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), {
          expires: 7,
          path: '/',
          sameSite: 'strict'
        });
        
        // Cập nhật state
        set({ user });
      },
      
      // Action để đăng xuất
      clearAuth: async () => {
        // Xóa cookie
        Cookies.remove(USER_COOKIE_NAME, { path: '/' });
        apiService.post('/Auth/log-out', {}, {});
        // Reset state
        set({ user: null });
      },
      
      // Getter để lấy thông tin user
      getUser: () => get().user,
    }),
    {
      name: 'auth-storage', // tên cho storage
      storage: createJSONStorage(() => localStorage), // sử dụng localStorage
      partialize: (state) => ({ user: state.user }), // chỉ lưu trường user
    }
  )
); 