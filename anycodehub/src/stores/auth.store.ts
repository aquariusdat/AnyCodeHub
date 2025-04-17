import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginResponse } from '@/types/auth';
import { apiService } from '@/services/api.service';
import Cookies from 'js-cookie';
import { EUserRole } from '@/types/enums';

// Tên cookie cho thông tin người dùng
const USER_COOKIE_NAME = 'X-USER-DATA';

// Định nghĩa interface cho state của auth store
interface AuthState {
  // Dữ liệu state
  user: User | null;
  isGoogleAccount: boolean;
  hasSetPassword: boolean;

  // Getter
  isAuthenticated: () => boolean;

  // Actions
  setAuth: () => Promise<{isGoogleAccount: boolean, hasSetPassword: boolean} | undefined>;
  clearAuth: () => Promise<void>;
  getUser: () => User | null;
  isAdmin: () => boolean;
}

// Tạo store với zustand và middleware persist để lưu trạng thái
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State mặc định
      user: null,
      isGoogleAccount: false,
      hasSetPassword: false,

      // Getter function
      isAuthenticated: () => !!get().user,

      // Action để set thông tin auth khi đăng nhập
      setAuth: async () => {
        try {
          let user = JSON.parse(Cookies.get(USER_COOKIE_NAME) || '{}');
          if (!user || Object.keys(user).length === 0) {
            return undefined;
          }

          // Kiểm tra trạng thái tài khoản
          const isGoogleAccount = user.authProvider === 'google';
          const hasSetPassword = user.hasPassword === true;

          // Cập nhật state
          set({ user, isGoogleAccount, hasSetPassword });
          
          return { isGoogleAccount, hasSetPassword };
        } catch (error) {
          console.error("Error setting auth:", error);
          return undefined;
        }
      },

      // Action để đăng xuất
      clearAuth: async () => {
        // Xóa cookie
        Cookies.remove(USER_COOKIE_NAME, { path: '/' });
        apiService.post('/Auth/log-out', {}, {});
        // Reset state
        set({ user: null, isGoogleAccount: false, hasSetPassword: false });
      },

      // Getter để lấy thông tin user
      getUser: () => {
        console.log(`getUser:: ${Cookies.get(USER_COOKIE_NAME)}`);
        
        if (!!!Cookies.get(USER_COOKIE_NAME)) {
          (async () => {
            await apiService.refreshToken();
          })();
        }

        if (!get().user) {
          try {
            let user = JSON.parse(Cookies.get(USER_COOKIE_NAME) || '{}');
            if (user && Object.keys(user).length > 0) {
              // Check if it's a Google account
              const isGoogleAccount = user.authProvider === 'google';
              const hasSetPassword = user.hasPassword === true;
              
              // Cập nhật state
              set({ user, isGoogleAccount, hasSetPassword });
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }

        return get().user;
      },

      isAdmin: () => {
        return get().user?.roles?.some(role => role === EUserRole.ADMIN) ?? false;
      },
    }),
    {
      name: 'auth-storage', // tên cho storage
      storage: createJSONStorage(() => localStorage), // sử dụng localStorage
      partialize: (state) => ({ 
        user: state.user,
        isGoogleAccount: state.isGoogleAccount, 
        hasSetPassword: state.hasSetPassword 
      }), // lưu trường user và các trạng thái liên quan
    }
  )
); 