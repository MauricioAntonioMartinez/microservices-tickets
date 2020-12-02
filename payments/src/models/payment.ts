import mongoose from "mongoose";

interface PaymentAttrs {
  stripeId: string;
  orderId: string;
}

interface PaymentDoc extends mongoose.Document {
  id: string;
  stripeId: string;
  orderId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const schema = new mongoose.Schema(
  {
    stripeId: {
      required: true,
      type: String,
    },
    orderId: {
      required: true,
      type: String,
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

schema.static("build", (attrs: PaymentAttrs) => new Payment(attrs));

const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", schema);

export { Payment };
