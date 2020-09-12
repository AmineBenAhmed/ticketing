import mongoose from 'mongoose';
import { app } from './app'

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
