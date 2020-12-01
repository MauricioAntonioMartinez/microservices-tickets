import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@tickets-mcuve/common";
import { Message } from "node-nats-streaming";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { Order } from "../model/Order";
import { natsWrapper } from "../nats-wrapper";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("Order Not Found");

    if (order.status === OrderStatus.Completed) return msg.ack();

    await order.set({ status: OrderStatus.Cancel }).save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        version: order.ticket.version,
      },
    });
    msg.ack();
  }
}
