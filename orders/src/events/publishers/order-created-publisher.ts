import { OrderCreatedEvent, Publisher, Subjects } from "@ticketingproj/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}