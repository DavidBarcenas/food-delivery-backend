import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';

const GRAPHQL_ENDPOINT = '/graphql';

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    const EMAIL = 'davee@mail.com';
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: { 
              email: "${EMAIL}",
              password: "12345",
              role: Owner
            }) {
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.createAccount.ok).toBeTruthy();
          expect(res.body.data.createAccount.error).toBeNull();
        });
    });

    it.todo('should fail if account already exists');
  });

  it.todo('login');
  it.todo('findByEmail');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
