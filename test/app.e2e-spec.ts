import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockedUserParams } from '../src/common/mocks';
import { AuthService } from '../src/auth/services/auth/auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/models';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: Repository<User>,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth', () => {
    afterEach(async () => {
      return await request(app.getHttpServer()).delete(
        `/auth/delete/${mockedUserParams.email}`,
      );
    });

    it('(POST) /auth/register', async () => {
      return await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedUserParams)
        .expect(201);
    });

    it('(POST) /auth/register - duplicate username', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedUserParams)
        .expect(201);

      return await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedUserParams)
        .expect(400);
    });

    it('(POST) /auth/register - duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedUserParams)
        .expect(201);

      mockedUserParams.username = 'new username';

      return await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedUserParams)
        .expect(400);
    });

    it('(POST) /auth/register - password too short', async () => {
      mockedUserParams.password = 'pass';

      return await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedUserParams)
        .expect(400);
    });
  });
});
