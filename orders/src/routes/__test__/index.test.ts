import { OrderStatus } from "@tickets-mcuve/common";
import { Mongoose, MongooseDocument } from "mongoose";
import { Order } from "../../model/Order";
import mongoose from "mongoose";
import { Ticket, TicketDoc } from "../../model/ticket";
import { app } from "../../app";
import request from "supertest";

export const createTicket = () =>
  Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 12.23,
    title: "SOme",
  }).save();

it("returns user order", async () => {
  const userA = global.signin();
  const userB = global.signin();

  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();
  const ticket4 = await createTicket();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userA)
    .send({ ticketId: ticket1.id })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", userB)
    .send({ ticketId: ticket2.id })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", userA)
    .send({ ticketId: ticket3.id })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", userA)
    .send({ ticketId: ticket4.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userA)
    .send({})
    .expect(200);
  expect(response.body.length).toEqual(3);
});
