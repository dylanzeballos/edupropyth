import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/infrastructure/guards/roles.guard';

describe('CoursesController', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: {},
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
        {
          provide: RolesGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
