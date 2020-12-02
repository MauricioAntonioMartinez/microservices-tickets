import axios from "axios";
import { NextPageContext } from "next";

const Client = ({ req }: { req: NextPageContext["req"] }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL: "http://www.mcuve.com/",
      headers: { ...req?.headers, host: "tickets.dev" },
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
export default Client;
