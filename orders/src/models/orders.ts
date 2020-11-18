import mongoose from 'mongoose';
import { OrderStatus } from '@ticketingproj/common';
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus }

interface OrderAttrs { //we added this interface to validate the order Model types
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
};

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc; //the build method validates properties in OrderDoc interface
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String, //here we are using mongoose which is a JS code therefore we used String with 'capital S' not 'string' type of TS
    required: true
  },

  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },

  expiresAt: {
    type: mongoose.Schema.Types.Date // expireAt not required and can be undefined
  },

  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => { // define build static method
  return new Order(attrs)
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };

