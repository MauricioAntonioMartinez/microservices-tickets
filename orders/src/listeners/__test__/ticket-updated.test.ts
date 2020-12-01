import { natsWrapper } from "../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@tickets-mcuve/common";
import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticket-updated-listener";
const setUp = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "some",
    price: 12.3,
  }).save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 213,
    title: "title",
    userId: "asdfasdfasdfa",
    version: ticket.version + 1,
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { listener, msg, data, ticket };
};

it("updates and saves a ticket", async () => {
  const { data, listener, msg, ticket } = await setUp();

  await listener.onMessage(data, msg as Message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks  the message", async () => {
  const { data, listener, msg } = await setUp();
  await listener.onMessage(data, msg as Message);
  expect(msg.ack).toBeCalled();
});

it("does not call ack if the event has not correctly correlation", async () => {
  const { data, listener, msg } = await setUp();

  data.version = 10;
  try {
    await listener.onMessage(data, msg as Message);
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
