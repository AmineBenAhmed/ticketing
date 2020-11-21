import { Publisher, Subjects } from "@ticketingproj/common";
import { ExpirationCompleteEvent } from '@ticketingproj/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}