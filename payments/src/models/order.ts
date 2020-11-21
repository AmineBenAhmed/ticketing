//we need to store orders used by payment service in the it's own DB
import { OrderStatus } from '@ticketingproj/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  id: string;
  version: number;
  price: number;
  userId: string;
  status: OrderStatus
}

interface OrderDoc extends mongoose.Document {
  price: number;
  userId: string;
  version: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc; 
}

const orderSchema = new mongoose.Schema({
  status: {
    type: String, //here we are using a javascript library therefore we must use "String" type with upper case
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id // chenge _id property to id
      delete ret._id
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin)

//build the shcema
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  });
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);//add the schema to mongoose models

export { Order }; 
