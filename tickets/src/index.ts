import mongoose from 'mongoose';
import { app } from './app'

const start = async () => {
  if (!process.env.JWT_KEY) { //JWT_KEY verification ==> the process.env in typeScript is either 
    //'undefined' or 'string' and if we make this check typescript excluede the undefined 
    //type and will expect string type and will not appear an error 
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be dedfined');
  }


  try {
  await mongoose.connect(process.env.MONGO_URI, {
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
