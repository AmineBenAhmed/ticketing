import { OrderCreatedEvent, OrderStatus } from "@ticketingproj/common";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
  //Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //Create and save the ticket
  const ticket  = Ticket.build({
    title: 'tttt',
    price: 55,
    userId: 'vdfvbtgrcs'
  });
  await ticket.save();

  //Create the fake data object
  const data: OrderCreatedEvent['data'] = {
      id: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: mongoose.Types.ObjectId().toHexString(),
      expiresAt: 'efefzs',
      ticket: {
          id: ticket.id,
          price: ticket.price,
      },
    };

    //Fake ack
    //@ts-ignore
    const msg: Message = {
      ack: jest.fn()
    }

    //retyrn al data
    return { listener, ticket, data, msg }
}

it('sets the userId of the ticket and acks the ', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);


  expect(updatedTicket!.orderId).toEqual(data.id);

  expect(msg.ack).toHaveBeenCalled()
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
//@ts-ignore
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);

})

