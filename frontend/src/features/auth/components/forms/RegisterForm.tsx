import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, registerUserSchema } from "@/features/auth/validation";
import { UserType } from "@/features/auth/types/user.type";
import { InputText, Button } from "@/shared/components/ui";
import UserTypeSelector from "@/features/auth/components/selectors/UserTypeSelector";

interface FormSignUpProps {
  userType: UserType;
  setUserType: (userType: UserType) => void;
  isLoading: boolean;
  onSubmit: (data: RegisterData) => void;
}

export default function RegisterForm({
  userType,
  setUserType,
  isLoading,
  onSubmit,
}: FormSignUpProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerUserSchema),
    mode: "onBlur",
  });

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
        Crear Cuenta
      </h2>

      <UserTypeSelector
        userType={userType}
        onChange={setUserType}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputText<RegisterData>
          label="Usuario"
          name="username"
          placeholder="Tu usuario"
          register={register}
          errors={errors}
          isRequired
        />

        <InputText<RegisterData>
          label="Email"
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          register={register}
          errors={errors}
          isRequired
        />

        <div className="grid grid-cols-2 gap-4">
          <InputText<RegisterData>
            label="Nombre"
            name="first_name"
            placeholder="Tu nombre"
            register={register}
            errors={errors}
            isRequired
          />

          <InputText<RegisterData>
            label="Apellido"
            name="last_name"
            placeholder="Tu apellido"
            register={register}
            errors={errors}
            isRequired
          />
        </div>

        <InputText<RegisterData>
          label="Biografía (Opcional)"
          name="bio"
          placeholder="Cuéntanos sobre ti..."
          register={register}
          errors={errors}
        />

        <InputText<RegisterData>
          label="Contraseña"
          name="password"
          type="password"
          placeholder="********"
          register={register}
          errors={errors}
          isRequired
        />

        <InputText<RegisterData>
          label="Confirmar Contraseña"
          name="password_confirm"
          type="password"
          placeholder="********"
          register={register}
          errors={errors}
          isRequired
        />

        <Button
          type="submit"
          label={
            isLoading
              ? 'Registrando...'
              : `Registrarse como ${userType === 'student' ? 'Estudiante' : 'Instructor'}`
          }
          variantColor="primary"
          disabled={isSubmitting || isLoading}
          className={`w-full ${isLoading
              ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
              : userType === 'student'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
        />
      </form>
    </div>
  );
};