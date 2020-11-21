import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@ticketingproj/common";
import { Message } from 'node-nats-streaming';
import { Order } from "../../models/order";
import { TicketCreatedPublisher } from "../publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

  const order = await Order.findOne({ // we must use "findOne" and not "find" because the "findOne" return a single document and after we can use for it "set()" or "save()" hooks and all other single doc hooks, minwhile "find returns an array"
    _id: data.id,                     //another thing somtimes we can retreive the order when is in update can retreive more than single doc in update we can have at the same time order with two status before is updated
    version: data.version - 1  //we need the version because if we retreive the order in an intermidiate time of update of the order wa can not retreive the asked order
  });

  if(!order) {
    throw new Error('Order not found');
  };

  order.set({ status: OrderStatus.Canceled });
  await order.save();
  
  msg.ack();
  }
}