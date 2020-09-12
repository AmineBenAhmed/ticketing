import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  //the signin function is defines in the setup.ts file as a global function because is reused many times in manu tests files
  const cookie = await global.signin(); //as the cookies are set when signied up
  //therefore we store it in cookie const to use it when getting current user
  
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)  //setting cookies to extract the jwt
    .send()
    .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
})
