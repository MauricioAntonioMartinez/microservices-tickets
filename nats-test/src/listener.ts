import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./ticketcreatedlistener";
import { TicketCreatedEvent } from "./events/ticket-created-event";
console.clear();

export const stan = nats.connect("tickets", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("LISTENER CONNECTED ");
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable() // this config ensures sending ALL the events if failed or restarted
  //   .setDurableName("orders-service"); // this sends all non processed events
  // // allow us to confirm
  // // that is something went wrong like trying to connect to the database, remit the data
  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "queue-group-name", //  queue group for all the services  listen, and don't reemit the data
  //   options // also the queue ensures that setDurableName is correctly applied
  // );
  // subscription.on("message", (data: Message) => {
  //   if (typeof data.getData() === "string")
  //     console.log(
  //       `MESSAGE RECEIVED (${data.getSequence()}): ${data.getData()}`
  //     );

  //   data.ack(); // without this nats will try to resend this data every 30s to the same
  //   // listener group
  // });

  stan.on("close", () => {
    // when we try to disconnect this listener or it restarted
    console.log("NATS CONNECTION CLOSE");
    process.exit();
  });
  const ticketListener = new TicketCreatedListener(stan);
  ticketListener.listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
