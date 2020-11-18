import { Publisher, Subjects, TicketCreatedEvent } from '@ticketingproj/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

