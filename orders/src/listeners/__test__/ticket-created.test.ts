import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@tickets-mcuve/common";
import { Ticket } from "../../model/ticket";
import mongoose, { mongo } from "mongoose";
const setUp = () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    price: 213,
    title: "title",
    userId: "asdfasdf",
    version: 1,
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { listener, msg, data };
};

it("creates and saves a ticket", async () => {
  const { data, listener, msg } = setUp();

  await listener.onMessage(data, msg as Message);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
it("acks  the message", async () => {
  const { data, listener, msg } = setUp();

  await listener.onMessage(data, msg as Message);

  expect(msg.ack).toBeCalled();
});
