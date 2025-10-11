import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import{ AppRouterProvider } from './AppRouter';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthCheck } from '@/features/auth/hooks/use-auth-check';

const queryClient = new QueryClient()

const AppContent = () => {
    useAuthCheck();
    
    return (
        <>
            <AppRouterProvider />
            <Toaster
                position="top-right"
                richColors
                closeButton
                duration={4000}
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    );
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <AppContent />
            </GoogleOAuthProvider>
        </QueryClientProvider>
    )
}

export default App;