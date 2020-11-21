import { Subjects } from './subjects';

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId?: string; //is not not used by services so is optionel
  }
}