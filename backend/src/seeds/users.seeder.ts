import { DataSource } from 'typeorm';
import { User, UserRole } from '../auth/domain/entities/user.entity';

interface SeedUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

const baseUsers: SeedUserData[] = [
  {
    email: 'superadmin@edupy.local',
    password: 'SuperAdmin123',
    firstName: 'Super',
    lastName: 'Admin',
    role: UserRole.ADMIN,
  },
  {
    email: 'instructor@edupy.local',
    password: 'Instructor123',
    firstName: 'Ada',
    lastName: 'Instructor',
    role: UserRole.TEACHER,
  },
  {
    email: 'encargado@edupy.local',
    password: 'Encargado123',
    firstName: 'Grace',
    lastName: 'Encargada',
    role: UserRole.TEACHER,
  },
];

const studentUsers: SeedUserData[] = Array.from({ length: 5 }, (_, idx) => ({
  email: "student" + (idx + 1) + "@edupy.local",
  password: 'Student123',
  firstName: "Student" + (idx + 1),
  lastName: 'Example',
  role: UserRole.STUDENT,
}));

const usersSeed: SeedUserData[] = baseUsers.concat(studentUsers);

export const seedUsers = async (dataSource: DataSource): Promise<void> => {
  const userRepository = dataSource.getRepository(User);

  for (const userData of usersSeed) {
    const existing = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (existing) {
      existing.password = userData.password;
      existing.firstName = userData.firstName;
      existing.lastName = userData.lastName;
      existing.role = userData.role;
      existing.isActive = true;
      await userRepository.save(existing);
    } else {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }
  }

  console.log('Seeded ' + usersSeed.length + ' users');
};
