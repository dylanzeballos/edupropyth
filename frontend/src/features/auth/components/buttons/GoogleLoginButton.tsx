import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';

interface GoogleLoginButtonProps {
    onSuccess?: (user: any) => void;
    onError?: (error: string) => void;
}

export const GoogleLoginButton = ({ onSuccess, onError }: GoogleLoginButtonProps) => {
    const [loading, setIsLoading] = useState(false);
    const { setAuth } = useAuthStore();

    const handleGoogleSuccess = async (response: { credential?: string }) => {
        try {
            setIsLoading(true);
            
            if (!response.credential) {
                throw new Error("No credential received from Google");
            }
            
            const result = await authService.googleAuth(response.credential);
            onSuccess?.(result);
            setAuth(result.user, result.access_token, result.refresh_token);
        } catch (error: any) {
            console.error("Google login error:", error);
            
            let errorMessage = "Error al iniciar sesión con Google";
            if (error.response?.data?.error) {
                errorMessage += `: ${error.response.data.error}`;
                console.error("Server error details:", error.response.data);
            }
            
            toast.error(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    const errorMessage = 'Error al iniciar sesión con Google';
                    toast.error(errorMessage);
                    onError?.(errorMessage);
                }}
                width="100%"
                theme="outline"
                text="signin_with"
                shape="rectangular"
                locale="es"
                size="large"
                logo_alignment="left"
            />
            
            {loading && (
                <div className="flex justify-center mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-500 ml-2">Procesando...</span>
                </div>
            )}
        </div>
    );
}