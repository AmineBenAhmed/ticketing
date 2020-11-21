import { Publisher, Subjects, TicketUpatedEvent } from '@ticketingproj/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

