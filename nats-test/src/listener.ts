import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';
import { Subjects } from './events/subjects';

console.clear();

const id = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', id, {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listner connected to NATS');

  stan.on('close', () => {
    console.log('NATS server closed'); //when we restart the program or close it takes some times to close 
    process.exit();//when using this event we execute the process.exit() to close it immediately  
    
  });

  new TicketCreatedListener(stan).listen();
  
});

process.on('SIGINT', () => stan.close());//when program retarted it fires the close event and execute the process.exit() ti terminate process now
process.on('SIGTERM', () => stan.close());//this when program is closed the program is closed immediately

