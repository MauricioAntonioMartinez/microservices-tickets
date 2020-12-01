import { Listener, OrderCreatedEvent, Subjects } from "@tickets-mcuve/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { QUEUE_GROUP_NAME } from "../queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ord = await Order.findById(data.id);

    if (ord) msg.ack();

    await Order.build({
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
      id: data.id,
    }).save();

    msg.ack();
  }
}
