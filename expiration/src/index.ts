import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {


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
} catch (err) {
  console.error(err);
}
};

start();
