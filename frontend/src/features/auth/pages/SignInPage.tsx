import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/forms/LoginForm";

export const SignInPage = () => {
    return (
        <AuthLayout type="login">
            <LoginForm />
        </AuthLayout>
    );
};
