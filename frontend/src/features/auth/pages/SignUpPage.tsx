import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/forms/RegisterForm";
import { useRegisterUser } from "../hooks/use-register-user";

export const SignUpPage = () => {
    const { handleSubmit, isPending } = useRegisterUser();

    return (
        <AuthLayout type="register">
            <RegisterForm
            onSubmit={handleSubmit}
            isPending={isPending}
            />
        </AuthLayout>
    );
};