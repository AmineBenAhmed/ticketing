import { Listener, OrderCancelledEvent, Subjects } from "@ticketingproj/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { TicketCreatedPublisher } from "../publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id } = data && data.ticket ? data.ticket : {id: null}
    const ticket = await Ticket.findById(id);

    if(!ticket) {
      throw new Error('Ticket not found');
    };

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      orderId: ticket.orderId,
      userId: ticket.userId,
      title: ticket.title,
      version: ticket.version
    });
  msg.ack();
  }
}