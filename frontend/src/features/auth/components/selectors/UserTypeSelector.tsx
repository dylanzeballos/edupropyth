import { UserType } from "@/features/auth/types/user.type";

interface UserTypeSelectorProps {
    userType: UserType;
    onChange: (userType: UserType) => void;
}

const UserTypeSelector = ({ userType, onChange }: UserTypeSelectorProps) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuario
            </label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onChange('student')}
                    className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${userType === 'student'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                >
                    <div className="text-lg font-semibold">👨‍🎓 Estudiante</div>
                    <div className="text-sm mt-1">
                        Accede a cursos y contenido educativo
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onChange('instructor')}
                    className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${userType === 'instructor'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                >
                    <div className="text-lg font-semibold">👨‍🏫 Instructor</div>
                    <div className="text-sm mt-1">
                        Crea y gestiona cursos
                    </div>
                </button>
            </div>
        </div>
    );
};

export default UserTypeSelector;