import { OrderCreatedEvent, OrderStatus } from "@tickets-mcuve/common";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCreatedListener } from "../listeners/order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

export const setUp = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = await Ticket.build({
    price: 12,
    title: "1223",
    userId: "asdfasdf",
  }).save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "dafdsfasd",
    expiresAt: "asdfadsf",
    version: 0,
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
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

  expect(updatedTicket?.orderId).toEqual(data.id);
});
it("acks the message", async () => {
  const { msg, data, listener } = await setUp();
  await listener.onMessage(data, msg as Message);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { msg, data, listener } = await setUp();
  await listener.onMessage(data, msg as Message);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const updateData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(updateData.orderId);
});
