import { postData } from "@/lib/api";
import { LoginResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../types/login.type';


export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        return await postData('/api/auth/login', data);
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        return await postData('/api/users', data);
    },

    async logout(): Promise<void> {
        await postData('/api/auth/logout', {});
    },

    async RefreshToken(): Promise<LoginResponse> {
        return await postData('/api/auth/refresh-token', {});
    },
}