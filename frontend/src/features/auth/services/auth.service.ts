import { postData } from "@/lib/api";
import { LoginResponse, LoginRequest, RegisterRequest, RegisterResponse, AuthResponse } from '../types/login.type';

export interface GoogleAuthResponse extends AuthResponse {
    access_token: string;
    refresh_token: string;
}

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        return await postData('/api/users/auth/login/', data);
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        return await postData('/api/users/', data);
    },

    googleAuth: async(idToken: string): Promise<GoogleAuthResponse> => {
        return await postData('/api/users/auth/google-login/', {
            id_token: idToken
        });
    },

    githubLogin: async(code: string): Promise<AuthResponse> =>{
       return await postData('/api/users/auth/github-login/', {code}) 
    },

    microsoftLogin: async(code: string): Promise<AuthResponse> =>{
        return await postData('/api/users/auth/microsoft-login/', {code});
    },

    async logout(): Promise<void> {
        await postData('/api/auth/logout', {});
    },

    async RefreshToken(): Promise<LoginResponse> {
        return await postData('/api/auth/refresh', {});
    },
}