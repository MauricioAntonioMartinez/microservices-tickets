import request from "supertest";
import { app } from "../../app";
import mongoose, { isValidObjectId } from "mongoose";
import { Ticket } from "../../model/ticket";
import { Order } from "../../model/Order";
import { OrderStatus } from "@tickets-mcuve/common";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exists", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(400);
});
it("returns an error if the ticket is already reserved", async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    title: "concet",
    price: 212,
  }).save();
  await Order.build({
    ticket,
    expiresIn: new Date(),
    status: OrderStatus.Created,
    userId: "some random id",
  }).save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(401);
});
it("returns a ticket", async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 122.32,
    title: "some",
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("emits an order created order", async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 122.32,
    title: "some",
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
