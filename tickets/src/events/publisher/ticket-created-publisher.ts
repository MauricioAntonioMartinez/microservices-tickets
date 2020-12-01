import { Publisher, Subjects, TicketCreatedEvent } from "@tickets-mcuve/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
