import mongoose from "mongoose";
import { Order, OrderStatus } from "../../../models/orders";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../order-complete-listener";
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent } from "@ticketingproj/common";


const setup = async () => {


  //create a listener
const listener = new ExpirationCompleteListener(natsWrapper.client);

  //create and save a ticket
const ticket = Ticket.build({
  id: mongoose.Types.ObjectId().toHexString(),
  title: 'newt voe',
  price: 211
});

await ticket.save();

//create order
const order = Order.build({
  status: OrderStatus.Created,
  userId: 'ercd',
  expiresAt: new Date(),
  ticket
})
await order.save();
  //create a fake data object
const data: ExpirationCompleteEvent['data'] = {
  orderId: order.id
}
  //create a fake msg object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  //return all of this stuff
return { listener, data, order, ticket, msg }; 
};

it('Updates the order status to cancelled', async () => {
  const { listener, data, order, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)

});


it('emit an OrderCancelled event', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
  (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});


it('ack the message', async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});


