import { motion, AnimatePresence } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
    type?: 'login' | 'register';
}

export const AuthLayout = ({ children, type = 'login' }: AuthLayoutProps) => {
    const config = {
        login: {
            title: "Inicia sesión en tu cuenta",
            subtitle: "Accede a tu laboratorio de programación con Python",
            imageSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
            imageAlt: "Estudiantes programando juntos"
        },
        register: {
            title: "Crea tu cuenta",
            subtitle: "Únete a la comunidad de EduProPyth y comienza a aprender",
            imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            imageAlt: "Nuevos estudiantes aprendiendo"
        }
    };

    const currentConfig = config[type];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="flex min-h-screen">
                <motion.div
                    key={type + '-image'} 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-20 bg-gradient-to-br from-blue-700 to-indigo-900"
                >
                    <div className="mx-auto max-w-lg text-center">
                        <motion.img
                            key={currentConfig.imageSrc}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-full h-auto rounded-lg shadow-2xl"
                            src={currentConfig.imageSrc}
                            alt={currentConfig.imageAlt}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-8"
                        >
                            <h3 className="text-2xl font-bold text-white">
                                EduProPyth
                            </h3>
                            <p className="mt-2 text-blue-100">
                                Tu laboratorio de programación con Python
                            </p>
                            <div className="mt-6 flex justify-center space-x-2">
                                <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                                <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Formulario - Derecha en desktop, completo en móvil */}
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    {/* Imagen en móvil */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto w-full max-w-sm lg:hidden mb-8"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">🐍</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                EduProPyth
                            </h3>
                        </div>
                    </motion.div>

                    {/* Contenedor del formulario con animación */}
                    <div className="mx-auto w-full max-w-md">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={type} // Key para animar transiciones entre login/register
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="text-center mb-8"
                            >
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {currentConfig.title}
                                </h2>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {currentConfig.subtitle}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={type + '-form'}
                                initial={{ opacity: 0, x: type === 'register' ? 50 : -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: type === 'register' ? -50 : 50 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};