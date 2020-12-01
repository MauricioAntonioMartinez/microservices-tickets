import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@tickets-mcuve/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
