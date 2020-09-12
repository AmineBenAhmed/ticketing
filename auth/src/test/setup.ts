//this version of mongo only runs in memory for test purposes and is very faster than local or cloud DB this will make test faster
import { MongoMemoryServer } from 'mongodb-memory-server'; 
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]> //the signin functon that is going to return a promess is going to resolve it self with a value of type array of string
    }
  }
}

let mongo: any;
beforeAll(async () => { //beforeAll is ahook function which runs before the test is executed
  mongo = new MongoMemoryServer();
  const mongoUri  = await mongo.getUri();

  await mongoose.connect(mongoUri, { //mongoose will connect with the mongoUri nd take as options the object
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => { //this hook runs before each test starts
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) { //before each test we will delete all collections
    await collection.deleteMany({});
  }
});

afterAll(async () => { //after all the test we reun this hook to delete the MongoMemoryServer instance from memory
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () =>  {
  const email = 'test@test.com'
  const password = 'password';
  process.env.JWT_KEY = 'mysecretecode'; ////as the process.env.JWT_KEY is verified in the 
  //index.ts and we splitted the setup file in index and app therefore we must redifine it here also

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  console.log(cookie);
  return cookie;
}