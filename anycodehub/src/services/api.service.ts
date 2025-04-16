import { useAuthStore} from '@/stores/auth.store';
import { ApiResponse } from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
}

// Flag to prevent multiple refresh token requests at the same time
let isRefreshing = false;
// Queue of callbacks to be executed after token refresh
let refreshQueue: Array<(token: string) => void> = [];

// Process all callbacks in the queue with the new token
const processQueue = (token: string) => {
    refreshQueue.forEach(callback => callback(token));
    refreshQueue = [];
};

class ApiService {
    private static instance: ApiService;

    // Private constructor to prevent direct instantiation
    private constructor() { }

    // Singleton pattern
    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    // Refresh token method
    private async refreshToken(): Promise<boolean> {
        try {
            // Return immediately if already refreshing
            if (isRefreshing) {
                return new Promise<boolean>(resolve => {
                    refreshQueue.push(() => resolve(true));
                });
            }

            isRefreshing = true;

            const response = await fetch(`${API_BASE_URL}/Auth/Token`, {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
            });

            if (!response.ok) {
                // If refresh token request fails, clear auth and redirect to login
                useAuthStore.getState().clearAuth();

                // If we're in a browser environment
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth?reason=session_expired';
                }

                isRefreshing = false;
                return false;
            }

            const refreshResponse = await response.json();
            if (refreshResponse.isSuccess) {
                // Process all queued requests with the new token
                processQueue('success');
                isRefreshing = false;
                return true;
            }

            useAuthStore.getState().clearAuth();

            // If we're in a browser environment
            if (typeof window !== 'undefined') {
                window.location.href = '/auth?reason=session_expired';
            }

            isRefreshing = false;
            return false;
        } catch (error) {
            console.error('Error refreshing token:', error);
            useAuthStore.getState().clearAuth();

            // If we're in a browser environment
            if (typeof window !== 'undefined') {
                window.location.href = '/auth?reason=session_expired';
            }

            isRefreshing = false;
            return false;
        }
    }

    // Generic request method with auto token refresh
    public async request<T>(
        url: string,
        options: RequestInit = {},
        skipAuth: boolean = false
    ): Promise<ApiResponse<T>> {
        const headers = new Headers(options.headers || {});

        // Set default headers if not already set
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
        if (!headers.has('Accept')) {
            headers.set('Accept', 'application/json');
        }

        // Merge with provided options
        const requestOptions: RequestInit = {
            ...options,
            headers,
            credentials: 'include', // Always include cookies
        };

        try {
            // Make the initial request
            let response = await fetch(`${API_BASE_URL}${url}`, requestOptions);

            // If response is 401 (Unauthorized) and we're not already refreshing and not a skip auth request
            if (response.status === 401 && !skipAuth && useAuthStore.getState().isAuthenticated()) {
                // Try to refresh the token
                const refreshSuccess = await this.refreshToken();

                if (refreshSuccess) {
                    // Retry the original request with new tokens (in cookies)
                    response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
                } else {
                    // If refresh failed, return an error response
                    return {
                        isSuccess: false,
                        isFailure: true,
                        error: {
                            code: 'AUTH_ERROR',
                            message: 'Authentication failed. Please login again.',
                        },
                        value: {} as T,
                    };
                }
            }

            // Parse the response
            const data = await response.json();

            // Handle different response formats
            if (data.isSuccess) return data as ApiResponse<T>;

            // If the API doesn't return in the expected format, wrap it
            return {
                isSuccess: data.isSuccess,
                isFailure: data.isFailure,
                value: data as T,
                error: data.isSuccess ? undefined : {
                    code: data.title,
                    message: data.detail,
                },
            };
        } catch (error) {
            console.error('API request error:', error);
            // Return a formatted error
            return {
                isSuccess: false,
                isFailure: true,
                error: {
                    code: 'REQUEST_ERROR',
                    message: error instanceof Error ? error.message : 'Unknown error occurred',
                },
                value: {} as T,
            };
        }
    }

    // HTTP method wrappers
    public async get<T>(url: string, options: RequestInit = {}, skipAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>(url, { ...options, method: 'GET' }, skipAuth);
    }

    public async post<T>(url: string, data: any, options: RequestInit = {}, skipAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>(
            url,
            {
                ...options,
                method: 'POST',
                body: JSON.stringify(data),
            },
            skipAuth
        );
    }

    public async put<T>(url: string, data: any, options: RequestInit = {}, skipAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>(
            url,
            {
                ...options,
                method: 'PUT',
                body: JSON.stringify(data),
            },
            skipAuth
        );
    }

    public async delete<T>(url: string, options: RequestInit = {}, skipAuth: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>(url, { ...options, method: 'DELETE' }, skipAuth);
    }
}

export const apiService = ApiService.getInstance(); 