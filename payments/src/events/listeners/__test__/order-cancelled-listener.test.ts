import { OrderCancelledEvent, OrderStatus } from '@ticketingproj/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { Order } from '../../../models/order';

import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-canceled-listener"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id:  mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'zdzdzd',
    version: 0,
    price: 22
  });

  await order.save();


  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'eferfef'
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { msg, data, listener, order }
};

it('updates the status of the order and acks the message', async () => {
  const { msg, data, listener, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
  expect(msg.ack).toHaveBeenCalled();
});

