//this version of mongo only runs in memory for test purposes and is very faster than local or cloud DB this will make test faster
import { MongoMemoryServer } from 'mongodb-memory-server'; 
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[] //the signin functon that is going to return a value of type array of string
    }
  }
}

let mongo: any;
beforeAll(async () => { //beforeAll is ahook function which runs before the test is executed
  process.env.JWT_KEY = 'tgt51g56t1';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
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

global.signin = () =>  {
  //Build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.co'
  }
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  
  //Build session Object, { jwt: MY_JWT }
  const session = { jwt: token };

  //Trun that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take that JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string thats the cookie with the encoded data    
  return [`express:sess=${base64}`];
}