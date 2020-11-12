import { Message } from 'node-nats-streaming';

import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects'
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated; //name of the channel we are leastening for and subject is a type of TicketCrated and with the same value
  queueGroupName = 'payments-service';//adding queu-group prevent sending one event to the compies of this listener and sent only for single one

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);
    msg.ack();
  }
}