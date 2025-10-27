import { DataSource } from 'typeorm';
import { User, UserRole } from '../auth/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  try {
    // Verificar si ya existe un admin
    const existingAdmin = await userRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('Admin123!', 10);

      const admin = userRepository.create({
        email: 'admin@edupropyth.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'System',
        role: UserRole.ADMIN,
        isActive: true,
      });

      await userRepository.save(admin);
      console.log('Usuario admin creado exitosamente');
      console.log('Email: admin@edupropyth.com');
      console.log('Password: Admin123!');
      console.log(
        'IMPORTANTE: Cambia la contraseña inmediatamente después del primer login',
      );
    } else {
      console.log('Ya existe un usuario admin en el sistema');
    }
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    throw error;
  }
}
