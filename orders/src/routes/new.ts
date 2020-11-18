import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ticketingproj/common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket';
import { Order } from '../models/orders';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
// const Ticket = mongoose.models.Ticket;
router.post('/api/orders', requireAuth,
  body('ticketId')
  .not()
  .isEmpty()
  .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // this custom validation to ensure that the ticketId is a mongoDB Id but this will return an error if the µs giving us the data using another DB else mongoDB
  .withMessage('ticketId must be provided'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body
    //Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
      throw new NotFoundError();
    }

    //Make sure that this ticket is not already reserved
    //run query to look at all orders. Find an order where ticket is the ticket we just found
    //and the orders status is not cancelled 
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    };

    //calculate the expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //Build order and saveit ro the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });

    await order.save();
    
    //publish an event that the order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      }
    });
    

  res.status(201).send(order);
});

export { router as createOrderRouter };

