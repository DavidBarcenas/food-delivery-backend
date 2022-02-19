import * as request from 'supertest';

import {Repository, getConnection} from 'typeorm';
import {Test, TestingModule} from '@nestjs/testing';

import {AppModule} from '../src/app.module';
import {INestApplication} from '@nestjs/common';
import {User} from 'src/users/entities/user.entity';
import {getRepositoryToken} from '@nestjs/typeorm';

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'davee@mail.com',
  password: '12345',
};

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let token: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: { 
              email: "${testUser.email}",
              password: "${testUser.password}",
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

    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: { 
              email: "${testUser.email}",
              password: "${testUser.password}",
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
          expect(res.body.data.createAccount.ok).toBeFalsy();
          expect(res.body.data.createAccount.error).toBe(
            'There is a user with that email already.',
          );
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation {
          login(input: { 
            email: "${testUser.email}",
            password: "${testUser.password}",
          }) {
            ok
            error
            token
          }
        }
      `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.login.ok).toBeTruthy();
          expect(res.body.data.login.error).toBeNull();
          expect(res.body.data.login.token).toEqual(expect.any(String));
          token = res.body.data.login.token;
        });
    });

    it('should not be able to login with wrong credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation {
          login(input: { 
            email: "${testUser.email}",
            password: "321312312313",
          }) {
            ok
            error
            token
          }
        }
      `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.login.ok).toBeFalsy();
          expect(res.body.data.login.error).toEqual(
            'The email or password is incorrect.',
          );
          expect(res.body.data.login.token).toBeNull();
        });
    });
  });

  describe('profile', () => {
    let userEmail: string;
    beforeEach(async () => {
      const [user] = await usersRepository.find();
      userEmail = user.email;
    });

    it("should see a user's", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', token)
        .send({
          query: `
          query {
            userProfile(email: "davee@mail.com") {
              ok
              error
              user {
                email
              }
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {ok, error, user} = res.body.data.userProfile;
          expect(ok).toBeTruthy();
          expect(error).toBeNull();
          expect(user.email).toBe(userEmail);
        });
    });

    it('should not find a profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', token)
        .send({
          query: `
          query {
            userProfile(email: "test@mail.com") {
              ok
              error
              user {
                email
              }
            }
          }
          `,
        })
        .expect(200)
        .expect(res => {
          const {ok, error, user} = res.body.data.userProfile;
          expect(ok).toBeFalsy();
          expect(error).toBe('User Not Found');
          expect(user).toBeNull();
        });
    });
  });

  describe('editProfile', () => {
    it('should change email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', token)
        .send({
          query: `
          mutation {
            editProfile(input: {
              email: "davee@gmail.com"
            }) {
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect(res => {
          const {ok, error} = res.body.data.editProfile;
          expect(ok).toBeTruthy();
          expect(error).toBeNull();
        });
    });
  });

  it.todo('verifyEmail');
});
