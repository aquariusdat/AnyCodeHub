import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../types/auth';
import { apiService } from './api.service';
import { authStore } from './auth.store';

export const authService = {
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        return apiService.post<RegisterResponse['value']>('/Auth/Register', data, {}, true);
    },

    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await apiService.post<LoginResponse['value']>('/Auth/Login', data, {}, true);
        
        // If login is successful, update auth store
        if (response.isSuccess) {
            authStore.setAuth(response as LoginResponse);
        }
        
        return response as LoginResponse;
    },
    
    async logout(): Promise<boolean> {
        try {
            // Call logout endpoint to invalidate tokens on the server
            const response = await apiService.post('/Auth/Logout', {});
            
            // Clear local auth data regardless of server response
            authStore.clearAuth();
            
            return response.isSuccess;
        } catch (error) {
            console.error('Logout error:', error);
            
            // Still clear local auth data even if server call fails
            authStore.clearAuth();
            
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