import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const id = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', id, {
  url: 'http://localhost:4222'
});   

stan.on('connect', async() => {
  console.log('Publish connected to NATS  ');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '55855',
      title: "64564",
      price: 6
    });
  } catch (err) {
    console.log(err);
  }

  // const data = JSON.stringify({
  //   id,
  //   title: 'connect',
  //   price: 20
  // });

  // stan.publish('ticket:created', data, ()=>{
  //   console.log('Event published');
  // });
});

