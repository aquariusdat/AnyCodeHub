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

  // Getter
  isAuthenticated: () => boolean;

  // Actions
  setAuth: () => Promise<void>;
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

      // Getter function
      isAuthenticated: () => !!get().user,

      // Action để set thông tin auth khi đăng nhập
      setAuth: async () => {
        // const user = loginResponse.value.userInformation;

        // // Lưu thông tin user vào cookie cho UI
        // Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), {
        //   expires: 7, // 7 ngày
        //   path: '/',
        //   sameSite: 'strict'
        // });
        let user = JSON.parse(Cookies.get(USER_COOKIE_NAME) || '');

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
      getUser: () => {
        console.log(`getUser:: ${Cookies.get(USER_COOKIE_NAME)}`);
        debugger;
        if (!!!Cookies.get(USER_COOKIE_NAME)) {
          (async () => {
            await apiService.refreshToken();
          })();
        }

        if (!get().user) {
          let user = JSON.parse(Cookies.get(USER_COOKIE_NAME) || '');

          // Cập nhật state
          set({ user });
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
      partialize: (state) => ({ user: state.user }), // chỉ lưu trường user
    }
  )
); 