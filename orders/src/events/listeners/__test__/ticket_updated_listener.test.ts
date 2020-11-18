import { TicketUpatedEvent } from '@ticketingproj/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {

  //create a listener
const listener = new TicketUpdatedListener(natsWrapper.client);

  //create and save a ticket
const ticket = Ticket.build({
  id: mongoose.Types.ObjectId().toHexString(),
  title: 'newt voe',
  price: 211
});

await ticket.save();

  //create a fake data object
const data: TicketUpatedEvent['data'] = {
  id: ticket.id,
  version: ticket.version + 1,
  title: 'another title',
  price: 999,
  userId: 'rondomuserid'
}
  //create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  //return all of this stuff
return { listener, data, ticket, msg }; 
}

it('finds, updates, and saves a ticket', async() => {
const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);//will update the ticket and save it

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);

});

it('acks the message', async() => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the called event is not the next one', async () => {
  const { data, listener, ticket, msg } = await setup();

  data.version = 5;
try {
  await listener.onMessage(data, msg);//when data updated the expected version is 1 but here the ticket version is 5 and then mongodb returns an error and update fails
} catch (err) {
  console.log(err);
  
}

expect(msg.ack).not.toHaveBeenCalled();
})