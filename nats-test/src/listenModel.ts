import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./events/subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected acWait = 5 * 1000;

  constructor(private client: Stan) {
    this.client = client;
  }
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // this config ensures sending ALL the events if failed or restarted
      .setManualAckMode(true)
      .setAckWait(this.acWait) // time to rest before resending messages
      .setDurableName(this.queueGroupName); // this sends all non processed events
    // allow us to confirm
    // that is something went wrong like trying to connect to the database, remit the data
  }
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subscription.on("message", (msg: Message) => {
      console.log(`Message received ${this.subject} / ${this.queueGroupName}`);
      const parseData = this.parseMessage(msg);
      this.onMessage(parseData, msg);
    });
  }
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
