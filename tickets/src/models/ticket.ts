import mongoose from 'mongoose';

interface TicketAttrs {
  title: string; // the "string" type with lower case is reserved only for typescript
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id // chenge _id property to id
      delete ret._id
    }
  }
});

//build the shcema
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);//add the schema to mongoose models

export { Ticket }; 
