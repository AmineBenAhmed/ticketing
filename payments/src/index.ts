import mongoose from 'mongoose';

import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-canceled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) { //JWT_KEY verification ==> the process.env in typeScript is either 
    //'undefined' or 'string' and if we make this check typescript excluede the undefined 
    //type and will expect string type and will not appear an error 
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be dedfined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be dedfined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be dedfined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be dedfined');
  }


  try {
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
    );
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  })

// here we can use 'this.client' getter or "this._client" property
  process.on('SIGINT', () => natsWrapper.client.close());//when program retarted it fires the close event and execute the process.exit() ti terminate process now
  process.on('SIGTERM', () => natsWrapper.client.close());//this when program is closed the program is closed immediately

  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();

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
