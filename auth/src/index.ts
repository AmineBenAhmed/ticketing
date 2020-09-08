import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
 
const app = express();
app.set('trust proxy', true); //because our traffic will be proxied to our application throw ingress inginx proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable cookie enreption because we will send toen wich is encrypted it self
    secure: true,
  })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', async (req, res) => {
  console.log(req.path);
  
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) { //JWT_KEY verification ==> the process.env in typeScript is either 
    //'undefined' or 'string' and if we make this check typescript excluede the undefined 
    //type and will expect string type and will not appear an error 
    throw new Error('JWT_KEY must be defined');
  }
  try {
  await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  console.log('Connected to mongodb...');
  
} catch (err) {
  console.error(err);
}

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
};

start();
