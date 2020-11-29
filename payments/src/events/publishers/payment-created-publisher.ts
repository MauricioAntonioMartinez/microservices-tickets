import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@tickets-mcuve/common";

export class PaymentCreatePublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
