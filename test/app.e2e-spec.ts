import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockedPostUserParams, mockedUserParams } from '../src/common/mocks';
import { AuthService } from '../src/auth/services/auth/auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/models';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '../src/auth/services/guards/local.strategy';
import { JwtStrategy } from '../src/auth/services/guards/jwt.strategy';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        AuthService,
        JwtService,
        LocalStrategy,
        JwtStrategy,
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
      mockedUserParams.username = 'test';
      mockedUserParams.password = 'password';
      return await request(app.getHttpServer()).delete(
        `/auth/${mockedUserParams.email}`,
      );
    });

    it('(POST) /auth/register and login', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedUserParams)
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockedUserParams.email,
          password: mockedUserParams.password,
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@email.com',
          password: mockedUserParams.password,
        })
        .expect(401);

      return await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockedUserParams.email,
          password: 'wrongpassword',
        })
        .expect(401);
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

  describe('/posts', () => {
    afterEach(async () => {
      return await request(app.getHttpServer()).delete(
        `/auth/${mockedPostUserParams.email}`,
      );
    });

    it('(POST) /posts - create post', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedPostUserParams)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockedPostUserParams.email,
          password: mockedPostUserParams.password,
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/posts')
        .send({ title: 'title', text: 'text' })
        .expect(401);

      await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer badToken`)
        .send({ title: 'title', text: 'text' })
        .expect(401);

      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${response.body.token}`)
        .send({ title: 'title', text: 'text' })
        .expect(201);
    });

    it('(POST) /posts - delete post', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockedPostUserParams)
        .expect(201);

      let response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockedPostUserParams.email,
          password: mockedPostUserParams.password,
        })
        .expect(200);

      const token = response.body.token;

      response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'title', text: 'text' })
        .expect(201);

      await request(app.getHttpServer()).delete(`/posts/notfound`).expect(401);

      await request(app.getHttpServer())
        .delete(`/posts/${response.body.id}`)
        .set('Authorization', `Bearer badToken`)
        .expect(401);

      await request(app.getHttpServer())
        .delete(`/posts/badId`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      return await request(app.getHttpServer())
        .delete(`/posts/${response.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });
});
