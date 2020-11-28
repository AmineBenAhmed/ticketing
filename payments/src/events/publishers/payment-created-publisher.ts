import { Publisher, Subjects, PaymentCreatedEvent } from '@ticketingproj/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

