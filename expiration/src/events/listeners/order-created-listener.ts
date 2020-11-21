import { Listener, OrderCreatedEvent, Subjects } from '@ticketingproj/common';

import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    await expirationQueue.add({ //create a new job if order:created event published and the job have orderId as param
      orderId: data.id
    },
    {
      delay,
    });
    msg.ack();
  }
} 