import { Publisher, Subjects, TicketUpdatedEvent } from "@tickets-mcuve/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
