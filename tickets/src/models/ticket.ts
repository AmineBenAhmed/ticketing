import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
  title: string; // the "string" type with lower case is reserved only for typescript
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc; //the mondel takes TicketAttrs as attributes and retursns TicketDoc
}

const ticketSchema = new mongoose.Schema({
  title: {
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
  orderId: {type: String }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id // chenge _id property to id
      delete ret._id
    }
  }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin)

//build the shcema
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);//add the schema to mongoose models

export { Ticket }; 
