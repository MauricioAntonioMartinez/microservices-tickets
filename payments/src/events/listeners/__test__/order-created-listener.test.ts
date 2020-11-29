import { OrderCreatedEvent, OrderStatus } from "@tickets-mcuve/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";

const setUp = () => {
  const ls = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "sdfs",
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      price: 12.31,
      id: "fasdfadad",
      version: 0,
    },
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { msg, data, ls };
};

it("creates an order when its listened", async () => {
  const { data, ls, msg } = await setUp();
  await ls.onMessage(data, msg as Message);

  const order = await Order.findById(data.id);

  expect(msg.ack).toHaveBeenCalled();
});
