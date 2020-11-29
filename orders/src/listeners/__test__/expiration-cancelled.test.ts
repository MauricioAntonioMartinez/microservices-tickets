import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";
import { Order } from "../../model/Order";
import { ExpirationCompleteEvent, OrderStatus } from "@tickets-mcuve/common";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../../events/publishers/order-cancelled-publisher";

const setUp = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 12,
    title: "123",
  });

  const order = await Order.build({
    status: OrderStatus.Created,
    expiresIn: new Date(),
    userId: "sdfsdf",
    ticket,
  }).save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { data, msg, listener, ticket, order };
};

it("Updates the order status to cancelled", async () => {
  const { data, listener, msg, order } = await setUp();

  await listener.onMessage(data, msg as Message);
  const orderUpdate = await Order.findById(order.id);
  expect(orderUpdate!.status).toEqual(OrderStatus.Cancel);
});

it("emit an OrderCancelled event", async () => {
  const { data, listener, msg, order } = await setUp();
  await listener.onMessage(data, msg as Message);

  const dataPub = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  expect(dataPub.id).toEqual(order.id);
});
it("ack the message", async () => {
  const { data, listener, msg } = await setUp();
  await listener.onMessage(data, msg as Message);
  expect(msg.ack).toHaveBeenCalledTimes(1);
});
