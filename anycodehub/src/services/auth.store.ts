import { User, LoginResponse } from '../types/auth';
import Cookies from 'js-cookie';

// Tên cookies
const USER_COOKIE_NAME = 'user_data';
const COOKIE_EXPIRES_DAYS = 7;

// Tên sự kiện tùy chỉnh cho auth state changes
export const AUTH_CHANGE_EVENT = 'auth_state_changed';

class AuthStore {
    private static instance: AuthStore;
    private user: User | null = null;

    private constructor() {
        this.loadFromClientCookies();
    }

    public static getInstance(): AuthStore {
        if (!AuthStore.instance) {
            AuthStore.instance = new AuthStore();
        }
        return AuthStore.instance;
    }

    // Load dữ liệu user từ client-side cookies
    private loadFromClientCookies() {
        try {
            const userCookie = Cookies.get(USER_COOKIE_NAME);
            if (userCookie) {
                this.user = JSON.parse(userCookie);
            }
        } catch (error) {
            console.error('Error loading user data from cookies:', error);
            this.clearAuth();
        }
    }

    // Phát sự kiện khi trạng thái xác thực thay đổi
    private dispatchAuthChangeEvent() {
        if (typeof window !== 'undefined') {
            // Tạo sự kiện tùy chỉnh
            const event = new CustomEvent(AUTH_CHANGE_EVENT, {
                detail: { authenticated: this.isAuthenticated() }
            });
            
            // Phát ra sự kiện
            window.dispatchEvent(event);
            
            // Đồng thời phát sự kiện storage để hỗ trợ các component đang lắng nghe storage
            window.dispatchEvent(new Event('storage'));
        }
    }

    // Lưu thông tin vào client-side cookies (chỉ sử dụng ở client)
    private saveToClientCookies() {
        if (this.user) {
            Cookies.set(USER_COOKIE_NAME, JSON.stringify(this.user), {
                expires: COOKIE_EXPIRES_DAYS,
                path: '/',
                sameSite: 'strict'
            });
        } else {
            Cookies.remove(USER_COOKIE_NAME, { path: '/' });
        }
    }

    public async setAuth(loginResponse: LoginResponse) {
        this.user = loginResponse.value.userInformation;
        
        // Chỉ lưu thông tin user cho UI, không đụng đến access token
        // vì API đã xử lý việc đặt HttpOnly cookies
        this.saveToClientCookies();
        
        // Thông báo thay đổi trạng thái xác thực
        this.dispatchAuthChangeEvent();
    }

    public async updateUserInfo(user: User) {
        this.user = user;
        this.saveToClientCookies();
        
        // Thông báo thay đổi thông tin người dùng
        this.dispatchAuthChangeEvent();
    }

    public async clearAuth() {
        this.user = null;
        
        // Xóa client-side cookie
        Cookies.remove(USER_COOKIE_NAME, { path: '/' });
        
        // Thông báo thay đổi trạng thái xác thực
        this.dispatchAuthChangeEvent();
        
        // Gọi API để logout và xóa HttpOnly cookies phía server nếu cần
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    public getUser(): User | null {
        return this.user;
    }

    public isAuthenticated(): boolean {
        // Client-side chỉ có thể kiểm tra sự tồn tại của user
        // Việc xác thực token thực tế sẽ diễn ra ở server thông qua middleware
        console.log(this.user);
        return !!this.user;
    }
}

export const authStore = AuthStore.getInstance(); 