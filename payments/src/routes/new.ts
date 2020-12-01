import { RequestHandler, Request, Response } from "express";
import express from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tickets-mcuve/common";
import { body } from "express-validator";
import { Order } from "../models/orders";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatePublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancel)
      throw new BadRequestError("Cannot pay for a cancel order");

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
      description: `OrderId:${order.id}`,
    });

    const payment = await Payment.build({
      orderId,
      stripeId: charge.id,
    }).save();

    new PaymentCreatePublisher(natsWrapper.client).publish({
      id: payment.id,
      stripeId: payment.stripeId,
      orderId: payment.orderId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export default router;
