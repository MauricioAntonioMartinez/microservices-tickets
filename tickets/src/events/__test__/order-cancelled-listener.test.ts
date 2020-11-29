import { OrderCancelledEvent } from "@tickets-mcuve/common";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../listeners/order-cancelled-listener";

const setUp = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const ticket = await Ticket.build({
    price: 12,
    title: "1223",
    userId: "asdfasdf",
  }).save();

  await ticket
    .set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    .save();

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version,
    ticket: {
      id: ticket.id,
      version: ticket.version,
    },
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { listener, ticket, msg, data };
};

it("sets the userId of the ticket", async () => {
  const { ticket, msg, data, listener } = await setUp();
  await listener.onMessage(data, msg as Message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
