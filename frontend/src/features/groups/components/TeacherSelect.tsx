import { UserAdmin } from '@/features/users';
import { getUserFullName } from '@/features/auth/types/user.type';

interface TeacherSelectProps {
  value?: string;
  onChange: (value: string) => void;
  teachers: UserAdmin[];
  isLoading?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const TeacherSelect = ({
  value,
  onChange,
  teachers,
  isLoading,
  error,
  disabled,
  required = false,
}: TeacherSelectProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="instructor"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Profesor Ejecutor {required && <span className="text-red-500">*</span>}
      </label>
      
      {isLoading ? (
        <div className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
          Cargando profesores...
        </div>
      ) : (
        <select
          id="instructor"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        >
          <option value="">Sin asignar</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {getUserFullName(teacher)} - {teacher.email}
            </option>
          ))}
        </select>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {!required && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Opcional: Puedes asignarlo más tarde
        </p>
      )}
    </div>
  );
};
