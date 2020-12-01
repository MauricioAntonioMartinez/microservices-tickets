import { OrderCancelledEvent, OrderStatus } from "@tickets-mcuve/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";

const setUp = async () => {
  const ls = new OrderCancelledListener(natsWrapper.client);
  const id = new mongoose.Types.ObjectId().toHexString();
  await Order.build({
    id,
    price: 123,
    status: OrderStatus.Created,
    userId: "Sdfasd",
    version: 0,
  }).save();

  const data: OrderCancelledEvent["data"] = {
    id,
    version: 1,
    ticket: {
      id: "fasdfadad",
      version: 0,
    },
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { msg, data, ls };
};

it("cancels an order when its listened", async () => {
  const { data, ls, msg } = await setUp();
  await ls.onMessage(data, msg as Message);

  const order = await Order.findById(data.id);
  expect(order?.status).toEqual(OrderStatus.Cancel);
});
it("acks the message", async () => {
  const { data, ls, msg } = await setUp();
  await ls.onMessage(data, msg as Message);
  expect(msg.ack).toHaveBeenCalled();
});
