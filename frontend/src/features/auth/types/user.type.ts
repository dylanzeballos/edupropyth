export type UserType = 'student' | 'instructor';

export interface UserFormData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    bio?: string;
    role: UserType;
}