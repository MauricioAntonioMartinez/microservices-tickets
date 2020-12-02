import { OrderStatus } from "@tickets-mcuve/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const schema = new mongoose.Schema(
  {
    status: {
      required: true,
      type: OrderStatus,
    },
    userId: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
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

schema.static("build", (attrs: OrderAttrs) => {
  return new Order({
    ...attrs,
    _id: attrs.id,
  });
});
const Order = mongoose.model<OrderDoc, OrderModel>("Order", schema);

export { Order };
