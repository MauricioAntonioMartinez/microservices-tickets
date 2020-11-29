import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";

it("fetches the ticket", async () => {
  const user = global.signin();

  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    price: 123.34,
    title: "sime",
  }).save();

  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: fetch } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send({})
    .expect(200);

  expect(fetch.id).toEqual(order.id);
});

it("returns an error for users trying to get others orders", async () => {
  const user = global.signin();

  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    price: 123.34,
    title: "sime",
  }).save();

  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send({})
    .expect(401);
});
