import { Listener, Subjects, TicketUpatedEvent } from "@ticketingproj/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpatedEvent['data'], msg: Message) {
  const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if(!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price});
    await ticket.save();

    msg.ack();
  }
}