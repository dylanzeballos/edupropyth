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

describe('Course Editions API (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let courseId: string;

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

    const coursesResponse = await request(app.getHttpServer())
      .get('/courses')
      .set(authHeader(adminToken))
      .expect(200);
    courseId = coursesResponse.body.data[0].id;
  });

  afterAll(async () => {
    await shutdownTestingApp();
  });

  it('lists course editions and filters by status', async () => {
    const response = await request(app.getHttpServer())
      .get(`/courses/${courseId}/editions`)
      .query({ status: 'ongoing' })
      .set(authHeader(adminToken))
      .expect(200);

    expect(response.body.meta.total).toBe(1);
    expect(response.body.data[0].label).toBe('II-2025');
  });

  it('creates, updates and archives an edition', async () => {
    const createResponse = await request(app.getHttpServer())
      .post(`/courses/${courseId}/editions`)
      .set(authHeader(adminToken))
      .send({
        label: 'I-2026',
        term: 'I',
        year: 2026,
        startDate: '2026-02-01T00:00:00Z',
        endDate: '2026-06-01T00:00:00Z',
      })
      .expect(201);

    const editionId = createResponse.body.id;

    await request(app.getHttpServer())
      .patch(`/courses/${courseId}/editions/${editionId}`)
      .set(authHeader(adminToken))
      .send({ term: 'Primero' })
      .expect(200);

    const archiveResponse = await request(app.getHttpServer())
      .patch(`/courses/${courseId}/editions/${editionId}/archive`)
      .set(authHeader(adminToken))
      .expect(200);

    expect(archiveResponse.body.status).toBe('archived');
    expect(archiveResponse.body.archivedAt).toBeTruthy();
  });

  it('prevents creating edition with duplicated label', async () => {
    await request(app.getHttpServer())
      .post(`/courses/${courseId}/editions`)
      .set(authHeader(adminToken))
      .send({
        label: 'II-2025',
        term: 'II',
        year: 2025,
      })
      .expect(409);
  });

  it('prevents deleting edition with enrollments', async () => {
    const response = await request(app.getHttpServer())
      .get(`/courses/${courseId}/editions`)
      .set(authHeader(adminToken))
      .expect(200);

    const editionId = response.body.data[0].id;

    await request(app.getHttpServer())
      .delete(`/courses/${courseId}/editions/${editionId}`)
      .set(authHeader(adminToken))
      .expect(409);
  });
});
