import { OrderStatus } from "@tickets-mcuve/common";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../model/Order";
import { Ticket } from "../../model/ticket";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
it("returns true if the order is successfully canceled", async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "sesdf",
    price: 123.32,
  }).save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send({})
    .expect(204);
  const orderUpdated = await Order.findById(order.id);
  expect(orderUpdated!.status).toEqual(OrderStatus.Cancel);
});

it("emits an event for cancelled order", async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    title: "sesdf",
    price: 123.32,
  }).save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send({})
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
