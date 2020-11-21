import  Queueu from 'bull';
import { natsWrapper } from '../nats-wrapper';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-event';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queueu<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST  
  }
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
  
});

export { expirationQueue };
