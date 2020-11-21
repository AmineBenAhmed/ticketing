import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@ticketingproj/common';
import { chargeRouter } from './routes/new';

export const app = express();
app.set('trust proxy', true); //because our traffic will be proxied to our application throw ingress inginx proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable cookie encryption because we will send toen wich is encrypted it self
    secure: process.env.NODE_ENV !== 'test', //the scure property allows that cookies not shared if only use make a https request it must be disabled when making test
  })
);

app.use(currentUser);

app.use(chargeRouter)

app.all('*', async (req, res) => {
  console.log(req.path);
  
  throw new NotFoundError();
});

app.use(errorHandler);
