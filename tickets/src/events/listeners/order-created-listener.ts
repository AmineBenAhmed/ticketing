import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from "@ticketingproj/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //If no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    //mark the as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
    //save the ticket0
    await ticket.save();
    await new TicketUpdatedPublisher(this.client)//when ticket is saved for update we must publidh an update event 
        .publish({
          id: ticket.id,
          price: ticket.price,
          title: ticket.title,
          userId: ticket.userId,
          version: ticket.version,
          orderId: ticket.orderId,
        });

    //ack message
    msg.ack();
  }

}