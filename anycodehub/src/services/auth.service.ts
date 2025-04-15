import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../types/auth';
import { apiService } from './api.service';
import { useAuthStore } from '@/stores/auth.store';
import Cookies from 'js-cookie';

export const authService = {
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        return apiService.post<RegisterResponse['value']>('/Auth/Register', data, {}, true);
    },

    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await apiService.post<LoginResponse['value']>('/Auth/Login', data, {}, true);
        
        // If login is successful, update auth store
        if (response.isSuccess) {
            await useAuthStore.getState().setAuth(response as LoginResponse);
        }
        
        return response as LoginResponse;
    },
    
    async logout(): Promise<boolean> {
        try {
            // Xóa cookies HTTP-Only thông qua API endpoint
            // try {
            //     await fetch('/api/auth/logout', {
            //         method: 'POST',
            //         credentials: 'include',
            //     });
            // } catch (error) {
            //     console.error('Error during server-side logout:', error);
            // }
            
            // Xóa cookies được đặt trực tiếp bởi API
            Cookies.remove('X-ACCESS-TOKEN', { path: '/' });
            Cookies.remove('X-REFRESH-TOKEN', { path: '/' });
            
            // Call backend logout endpoint
            const response = await apiService.post('/Auth/Logout', {});
            
            // Clear local auth data
            await useAuthStore.getState().clearAuth();
            
            return response.isSuccess;
        } catch (error) {
            console.error('Logout error:', error);
            
            // Still clear local auth data even if server call fails
            await useAuthStore.getState().clearAuth();
            
            return false;
        }
    },
    
    // Method to check if the current session is valid
    async validateSession(): Promise<boolean> {
        try {
            // Make a request to a protected endpoint
            const response = await apiService.get('/Auth/ValidateSession');
            return response.isSuccess;
        } catch (error) {
            return false;
        }
    }
}; 