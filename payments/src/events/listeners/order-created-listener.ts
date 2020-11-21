import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from "@ticketingproj/common";
import { Message } from 'node-nats-streaming';
import { Order } from "../../models/order";

import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    
    const order = Order.build({
          id: data.id,
          price: data.ticket.price,
          userId: data.userId,
          status: data.status,
          version: data.version,
        });
  await order.save();
    //ack message
    msg.ack();
  }

}