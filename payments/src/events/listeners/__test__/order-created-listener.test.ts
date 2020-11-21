import { OrderCreatedEvent, OrderStatus } from "@ticketingproj/common";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
  //Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //Create the fake data object
  const data: OrderCreatedEvent['data'] = {
      id: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: mongoose.Types.ObjectId().toHexString(),
      expiresAt: 'efefzs',
      ticket: {
          id:  mongoose.Types.ObjectId().toHexString(),
          price: 12,
      },
    };

    //Fake ack
    //@ts-ignore
    const msg: Message = {
      ack: jest.fn()
    }

    //retyrn al data
    return { listener, data, msg }
}

it('replicates the order and acks the ', async () => {
  const { listener,  data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);


  expect(order!.price).toEqual(data.ticket.price);

  expect(msg.ack).toHaveBeenCalled()
});

// it('publishes a ticket updated event', async () => {
//   const { listener, data, msg } = await setup();

//   await listener.onMessage(data, msg);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// //@ts-ignore
//   const ticketUpdatedData = JSON.parse(
//     (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
//   );

//   expect(data.id).toEqual(ticketUpdatedData.orderId);

// })

