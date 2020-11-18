import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'; 

import { Order, OrderStatus } from './orders';

interface TicketAttrs {
  id: string,
  title: string,
  price: number,
};

export interface TicketDoc extends mongoose.Document{
  title: string,
  price: number,
  version: number,
  isReserved(): Promise<boolean>
};

interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null> //the promise can result a null value if ticket not found
};

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.set('versionKey', 'version'); //replace the __v field of the doc to version
ticketSchema.plugin(updateIfCurrentPlugin); //this module modifies the $where and can be repalces by the code below
// ticketSchema.pre('save', function(done) {
//   //@ts-ignore => this tells ts to ignore the error below
//   this.$where = { //
//     version: this.get('version') - 1
//   };

//   done();
// })


ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,//we need here the id given by the ticket service "which is the id of the created one in the ticket service" 
    //to use this that id if is passed with name id mongodb will take at as parameter 
    //to use it as id of the ticket saved in orders service ticket collection we must affect it to the _id parp
    title: attrs.title,
    price:  attrs.price
  })
};

ticketSchema.methods.isReserved = async function() {//must be regular function and not arrow function
//the keyword "this" === the ticket document that we just called 'isReserved' on
const existingOrder = await Order.findOne({
  ticket: this,
  status: {
    $in: [
      OrderStatus.Created,
      OrderStatus.AwaitingPayment,
      OrderStatus.Complete
    ]
  }
});
return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
