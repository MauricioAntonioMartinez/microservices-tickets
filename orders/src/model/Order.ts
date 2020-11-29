import mongoose from "mongoose";
import { OrderStatus } from "@tickets-mcuve/common";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface Order {
  userId: string;
  expiresIn: Date;
  status: OrderStatus;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  expiresIn: Date;
  status: OrderStatus;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: Order): OrderDoc;
}

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

schema.set("versionKey", "version");
schema.plugin(updateIfCurrentPlugin);

schema.statics.build = (attrs: Order) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("order", schema);

export { Order };

// const set = new Map<{name:string},{value:string}>()
// set.set({name:"me"},{value:"me 2"})
