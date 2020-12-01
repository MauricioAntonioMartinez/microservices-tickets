import { Listener, Subjects, TicketCreatedEvent } from "@tickets-mcuve/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../model/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketCreatedEvent["data"], message: Message) {
    try {
      await Ticket.build({
        id: data.id,
        price: data.price,
        title: data.title,
      }).save();
      message.ack();
    } catch (e) {
      console.log(e);
    }
  }
}
