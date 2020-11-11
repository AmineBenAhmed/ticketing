import { Subjects } from './subjects';

export interface TicketUpatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  }
}