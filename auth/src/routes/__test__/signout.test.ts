import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  process.env.JWT_KEY = 'mysecretecode'; //don't miss the process.env.JWT_KEY
  await request(app) 
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(204);

  expect(response.get('Set-Cookie')[0]).toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'); // this value is taken from console.log(response.get('Set-Cookie')) 
  
});
