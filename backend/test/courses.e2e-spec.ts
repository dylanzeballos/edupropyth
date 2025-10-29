import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  bootstrapTestingApp,
  shutdownTestingApp,
  truncateDatabase,
} from './utils/db';
import { seedTestData } from './utils/fixtures';
import { authHeader, loginAs } from './utils/auth';
import { DataSource } from 'typeorm';

describe('Courses API (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    app = await bootstrapTestingApp();
  });

  beforeEach(async () => {
    await truncateDatabase();
    const dataSource = app.get(DataSource);
    await seedTestData(dataSource);

    const auth = await loginAs(app, {
      email: 'superadmin@edupy.local',
      password: 'SuperAdmin123',
    });
    adminToken = auth.accessToken;
  });

  afterAll(async () => {
    await shutdownTestingApp();
  });

  it('lists courses with pagination', async () => {
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set(authHeader(adminToken))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.total).toBe(1);
    expect(response.body.data[0]).toMatchObject({
      code: 'PY-BASICO',
      name: 'Programación con Python',
    });
  });

  it('creates, updates and deletes a course', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/courses')
      .set(authHeader(adminToken))
      .send({
        code: 'JS-INTRO',
        name: 'Introducción a JavaScript',
        description: 'Curso básico de JavaScript.',
      })
      .expect(201);

    const courseId = createResponse.body.id;

    const updateResponse = await request(app.getHttpServer())
      .patch(`/courses/${courseId}`)
      .set(authHeader(adminToken))
      .send({ name: 'JS Fundamentals' })
      .expect(200);

    expect(updateResponse.body.name).toBe('JS Fundamentals');

    await request(app.getHttpServer())
      .delete(`/courses/${courseId}`)
      .set(authHeader(adminToken))
      .expect(204);
  });

  it('prevents deleting course with editions', async () => {
    const response = await request(app.getHttpServer())
      .get('/courses')
      .set(authHeader(adminToken))
      .expect(200);

    const courseId = response.body.data[0].id;

    await request(app.getHttpServer())
      .delete(`/courses/${courseId}`)
      .set(authHeader(adminToken))
      .expect(409);
  });
});
