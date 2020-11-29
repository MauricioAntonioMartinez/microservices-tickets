import { Publisher, Subjects, TicketUpdatedEvent } from "@tickets-mcuve/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
