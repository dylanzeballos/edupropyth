import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Button, InputText } from "@/shared/components/ui";
import { loginSchema, LoginFormData } from "../../validation/login.schema";
import { UseLoginUser } from "../../hooks/use-login-user";

export const LoginForm = () => {
    const { mutate: loginUser, isPending } = UseLoginUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = (data: LoginFormData) => {
        loginUser(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <Button
                type="button"
                variantColor="secondary"
                disabled={isPending}
                label="Continuar con Google"
                className="w-full"
            />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                        O continúa con tu email
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputText
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    register={register}
                    errors={errors.email}
                />

                <InputText
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    register={register}
                    errors={errors.password}
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            {...register("rememberMe")}
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            Recordar sesión
                        </span>
                    </label>
                    <Link 
                        to="/auth/forgot-password" 
                        className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <Button
                    type="submit" 
                    variantColor="primary"
                    disabled={isPending} 
                    className="w-full"
                    loading={isPending}
                    label="Iniciar sesión"
                    loadingText="Iniciando sesión..."
                />
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                ¿No tienes una cuenta?{' '}
                <Link 
                    to="/register" 
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline"
                >
                    Regístrate aquí
                </Link>
            </p>
        </motion.div>
    );
};