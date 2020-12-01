import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tickets-mcuve/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../model/ticket";
import { Order } from "../model/Order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket Id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new NotAuthorizedError();

    const expiryDate = new Date();

    expiryDate.setSeconds(expiryDate.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const order = await Order.build({
      expiresIn: expiryDate,
      status: OrderStatus.Created,
      ticket,
      userId: req.currentUser!.id,
    }).save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      expiresAt: order.expiresIn.toISOString(),
      id: order.id,
      version: order.version,
      status: order.status,
      ticket: {
        id: ticket.id,
        price: ticket.price,
        version: ticket.version,
      },
      userId: req.currentUser!.id,
    });

    res.status(201).send(order);
  }
);

export default router;
