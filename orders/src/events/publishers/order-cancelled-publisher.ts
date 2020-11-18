import { OrderCancelledEvent, Publisher, Subjects } from "@ticketingproj/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}