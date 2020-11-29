import { Message } from "node-nats-streaming";
import { Subjects } from "./events/subjects";
import { TicketCreatedEvent } from "./events/ticket-created-event";
import { Listener } from "./listenModel";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.ticketCreated;
  // you can change the enum to other one or completely other data type
  queueGroupName = "payments-service";

  onMessage(msg: TicketCreatedEvent["data"], data: Message) {
    data.ack();
  }
}
