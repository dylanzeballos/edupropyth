import RegisterForm from '@/features/auth/components/forms/RegisterForm';
import { useSignUp } from '@/features/auth/hooks/use-register-user';

export const SignUpPage = () => {
  const { userType, setUserType, loading, handleSubmit } = useSignUp();

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-15 md:pb-20">
        <div>
          <RegisterForm
            userType={userType}
            setUserType={setUserType}
            isLoading={loading}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </>
  );
};
