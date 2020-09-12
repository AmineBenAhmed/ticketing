import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => { //here we used async keyword
  //without await inside of the function because when returned data if it was used 
  //automatically is returned as async function without need of await keyword

  process.env.JWT_KEY = 'mysecretecode'; //as the process.env.JWT_KEY is verified in the 
  //index.ts and we splitted the setup file in index and app therefore we must redifine it here also
  return request(app) 
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with invalid email', async () => {
  return request(app) 
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with invalid password', async () => {
  return request(app) 
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p'
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  return request(app) 
    .post('/api/users/signup')
    .send({})
    .expect(400);
});

it('returns a 400 with missing email or password', async () => {
  await request(app) 
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);

  return request(app) 
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400);
});

it('disallows duplicated emails', async () => {
  await request(app) 
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  return request(app) 
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'mytestedpassword'
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app) 
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined()
})