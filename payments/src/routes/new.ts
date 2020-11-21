import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@ticketingproj/common';

import { stripe } from '../stripe';
import { Order } from '../models/order';
// import { OrderCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedListener } from '../events/listeners/order-created-listener';
import { Payment } from '../models/payment';

const router = express.Router();

router.post('/api/payments', requireAuth,[
  body('token')
    .not()
    .isEmpty()
    .withMessage('Invalid token'),
  body('orderId')
    .not()
    .isEmpty()
] , validateRequest,
async (req: Request, res: Response) => {
  const { orderId, token } = req.body;

  const order = await Order.findById(orderId);
  
  if(!order) {
    throw new NotFoundError();
  }

  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if(order.status === OrderStatus.Canceled) {
    throw new BadRequestError('Cannot pay cancelled order');
  }
console.log(order.status);

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token
  });

  order.set({ status: OrderStatus.Complete });
  await order.save();

  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  });

  await payment.save();

  res.status(201).send({ success: 'ok' });
});

export { router as  chargeRouter};