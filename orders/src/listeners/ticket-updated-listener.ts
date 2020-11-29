import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@tickets-mcuve/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../model/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  readonly queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    try {
      const ticket = await Ticket.findByEvent(data);
      if (!ticket) throw new Error("Ticket not found");

      const { title, price } = data;
      ticket.set({ title, price });
      await ticket.save();
      // ticket.version = data.version;

      msg.ack();
    } catch (e) {
      console.log(e);
    }
  }
}
