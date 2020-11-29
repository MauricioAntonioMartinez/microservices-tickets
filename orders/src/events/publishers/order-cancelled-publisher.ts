import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@tickets-mcuve/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
