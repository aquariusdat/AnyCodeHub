import { User, LoginResponse } from '../types/auth';

class AuthStore {
    private static instance: AuthStore;
    private user: User | null = null;

    private constructor() {
        this.loadFromStorage();
    }

    public static getInstance(): AuthStore {
        if (!AuthStore.instance) {
            AuthStore.instance = new AuthStore();
        }
        return AuthStore.instance;
    }

    private loadFromStorage() {
        try {
            const user = localStorage.getItem('user');
            if (user) this.user = JSON.parse(user);
        } catch (error) {
            console.error('Error loading user data from storage:', error);
            this.clearAuth();
        }
    }

    private saveToStorage() {
        try {
            if (this.user) {
                localStorage.setItem('user', JSON.stringify(this.user));
            } else {
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Error saving user data to storage:', error);
        }
    }

    public setAuth(loginResponse: LoginResponse) {
        this.user = loginResponse.value.userInformation;
        this.saveToStorage();
    }

    public updateUserInfo(user: User) {
        this.user = user;
        this.saveToStorage();
    }

    public clearAuth() {
        this.user = null;
        localStorage.removeItem('user');
    }

    public getUser(): User | null {
        return this.user;
    }

    public isAuthenticated(): boolean {
        return !!this.user;
    }
}

export const authStore = AuthStore.getInstance(); 