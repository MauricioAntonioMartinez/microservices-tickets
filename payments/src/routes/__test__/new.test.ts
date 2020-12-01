import { app } from "../../app";
import mongoose from "mongoose";
import request from "supertest";
import { Order } from "../../models/orders";
import { OrderStatus } from "@tickets-mcuve/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

// jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exists", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "sdfad",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it("returns a 401 when purchasing an order that doesn't belong to the user", async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 12.32,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  }).save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "adfa",
      orderId: order.id,
    })
    .expect(401);
});
it("return a 400 when purchasing a cancelled order", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 12.32,
    status: OrderStatus.Cancel,
    userId: id,
    version: 0,
  }).save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(id))
    .send({
      token: "adfa",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 10000);
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price,
    status: OrderStatus.Created,
    userId,
    version: 0,
  }).save();
  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const charges = await stripe.charges.list({
    limit: 50,
  });

  const ch = charges.data.find((e) => e.amount === price * 100);

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: ch!.id,
  });

  expect(payment).not.toBeNull();
  expect(ch).toBeDefined();
  expect(ch?.currency).toEqual("usd");
  //   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  //   expect(chargeOptions.source).toEqual("tok_visa");
  //   expect(chargeOptions.amount).toEqual(12.32 * 100);
  //   expect(chargeOptions.currency).toEqual("usd");
});
