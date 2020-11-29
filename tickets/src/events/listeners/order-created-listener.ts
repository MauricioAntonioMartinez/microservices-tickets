import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from "@tickets-mcuve/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], message: Message) {
    try {
      const ticketFetch = await Ticket.findById(data.ticket.id);
      if (!ticketFetch) throw new NotFoundError();

      const ticket = await ticketFetch.set({ orderId: data.id }).save();

      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: ticket.version,
        orderId: ticket.orderId,
      });

      message.ack();
    } catch (e) {}
  }
}
