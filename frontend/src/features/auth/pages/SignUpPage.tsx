import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/forms/RegisterForm";

export const SignUpPage = () => {
    return (
        <AuthLayout type="register">
            <RegisterForm />
        </AuthLayout>
    );
};