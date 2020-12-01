import {
  Listener,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@tickets-mcuve/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { QUEUE_GROUP_NAME } from "../queueGroupName";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ord = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!ord) throw new Error("Order Not Found");

    await ord.set({ status: OrderStatus.Cancel }).save();

    msg.ack();
  }
}
