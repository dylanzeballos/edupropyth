import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/user.type";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
}

interface AuthActions {
    login: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (Loading: boolean) => void;
    setUser: (user: User) => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: null,

            login: (user: User, token: string) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            },

            setLoading: (Loading: boolean) => {
                set({ isLoading: Loading });
            },
            setUser: (user: User) => {
                set({ user });
            },
            updateUser: (user: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...user }
                    });
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);