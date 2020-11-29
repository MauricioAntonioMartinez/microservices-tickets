/// <reference types="node" />

import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();
const stan = nats.connect("tickets", "abx", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");
  // const data = JSON.stringify({
  //   id: 1,
  //   title: "some title",
  //   price: 12.33,
  // });
  // stan.publish("ticket:created", data, () => {
  //   console.log("EVENT PUBLISH");
  // });
  const pb = new TicketCreatedPublisher(stan);
  try {
    await pb.publish({ id: "1", price: 12.12, title: "This is a new title" });
  } catch (e) {}
});
