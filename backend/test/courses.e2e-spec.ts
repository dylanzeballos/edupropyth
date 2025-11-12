import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/infrastructure/guards/jwt-auth.guard';
import { CourseAdminGuard } from '../src/courses/infrastructure/guards/course-admin.guard';
import { CourseEditorGuard } from '../src/courses/infrastructure/guards/course-editor.guard';
import { CourseStatusGuard } from '../src/courses/infrastructure/guards/course-status.guard';
import { CreateCourseUseCase } from '../src/courses/application/use-cases/create-course.use-case';
import { GetCourseUseCase } from '../src/courses/application/use-cases/get-course.use-case';
import { UpdateCourseUseCase } from '../src/courses/application/use-cases/update-course.use-case';
import { CourseStatus } from '../src/courses/domain/enums/course-status.enum';

describe('CoursesController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let createCourseUseCase: { execute: jest.Mock };
  let getCourseUseCase: { execute: jest.Mock; executeAll: jest.Mock };
  let updateCourseUseCase: { execute: jest.Mock };

  const courseResponse = {
    id: 'course-1',
    title: 'Demo Course',
    description: 'Desc',
    status: CourseStatus.DRAFT,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeAll(async () => {
    createCourseUseCase = { execute: jest.fn() };
    getCourseUseCase = { execute: jest.fn(), executeAll: jest.fn() };
    updateCourseUseCase = { execute: jest.fn() };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // allow all guards for this e2e suite
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CourseAdminGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CourseEditorGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CourseStatusGuard)
      .useValue({ canActivate: () => true })
      // mock use-cases so we don't depend on DB
      .overrideProvider(CreateCourseUseCase)
      .useValue(createCourseUseCase)
      .overrideProvider(GetCourseUseCase)
      .useValue(getCourseUseCase)
      .overrideProvider(UpdateCourseUseCase)
      .useValue(updateCourseUseCase)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /courses -> 201 with created course', async () => {
    createCourseUseCase.execute.mockResolvedValue(courseResponse);

    const res = await request(httpServer)
      .post('/courses')
      .send({ title: 'Demo Course', description: 'Desc' })
      .expect(201);

    expect(res.body).toMatchObject({ id: 'course-1', title: 'Demo Course' });
    expect(createCourseUseCase.execute).toHaveBeenCalledWith(
      { title: 'Demo Course', description: 'Desc' },
      undefined,
    );
  });

  it('GET /courses -> 200 with list', async () => {
    getCourseUseCase.executeAll.mockResolvedValue([courseResponse]);

    const res = await request(httpServer).get('/courses').expect(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('GET /courses/:id -> 200 with item', async () => {
    getCourseUseCase.execute.mockResolvedValue(courseResponse);

    const res = await request(httpServer).get('/courses/course-1').expect(200);
    expect(res.body).toMatchObject({ id: 'course-1' });
  });

  it('PATCH /courses/:id -> 200 with updated', async () => {
    const updated = { ...courseResponse, title: 'Updated' };
    updateCourseUseCase.execute.mockResolvedValue(updated);

    const res = await request(httpServer)
      .patch('/courses/course-1')
      .send({ title: 'Updated' })
      .expect(200);

    expect(res.body).toMatchObject({ id: 'course-1', title: 'Updated' });
    expect(updateCourseUseCase.execute).toHaveBeenCalledWith(
      'course-1',
      { title: 'Updated' },
      undefined,
    );
  });
});
