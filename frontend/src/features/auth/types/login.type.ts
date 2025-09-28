export interface LoginData {
    username: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user_id: number;
    username: string;
    email: string;
    profile_data: Record<string, unknown>;
}