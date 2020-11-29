import { Publisher, Subjects, TicketCreatedEvent } from "@tickets-mcuve/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
