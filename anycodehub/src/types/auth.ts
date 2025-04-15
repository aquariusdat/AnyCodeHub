export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthOfDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiError {
    code: string;
    message: string;
}

export interface ApiResponse<T> {
    value: T;
    isSuccess: boolean;
    isFailure: boolean;
    error?: ApiError;
    status?: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    passwordConfirmed: string;
    birthOfDate: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export type RegisterResponse = ApiResponse<{
    user: User;
    token: string;
}>;

export type LoginResponse = ApiResponse<{
    accessToken: string;
    accessTokenExpirationTime: string;
    refreshToken: string;
    refreshTokenExpirationTime: string;
    userInformation: User;
}>;

export type RefreshTokenResponse = ApiResponse<{
    accessToken: string;
    accessTokenExpirationTime: string;
    refreshToken: string;
    refreshTokenExpirationTime: string;
    userInformation: User;
}>;
