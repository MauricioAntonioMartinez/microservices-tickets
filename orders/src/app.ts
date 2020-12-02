import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@tickets-mcuve/common";
import createOrderRouter from "./routes/new";
import showOrderRouter from "./routes/show";
import indexOrderRouter from "./routes/index";
import deleteTicketRouter from "./routes/patch";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, // process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
