import { postData } from "@/lib/api";
import { UserFormData } from "@/features/auth/types/user.type";

export interface AuthResponse {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    full_name: string;
    profile_role: string;
    message?: string;
}

export const authService = {
    register: async (data: UserFormData): Promise<AuthResponse> => {
        return await postData('/api/users/', data);
    },
}