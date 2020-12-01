import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@tickets-mcuve/common";
import { Message } from "node-nats-streaming";
import { Order } from "../model/Order";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error("Order Not Found");

    await order
      .set({
        status: OrderStatus.Completed,
      })
      .save();

    msg.ack();
  }
}
