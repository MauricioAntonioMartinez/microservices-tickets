import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
<<<<<<< HEAD
  console.log("STRING AUTH SERVICE...");
=======
>>>>>>> b7415cec064eaeac20f12cb5ebf4906061cdf478
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) throw new Error("MONGO URI MUST BE DEFINED");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
