import buildClient from "../api/build-client";

import React from "react";
import { AppContext } from "next/app";
import { Ticket, TicketItem } from "../components/TicketItem";
import { CurrentUser } from "./_app";

interface Props {
  currentUser?: CurrentUser;
  tickets?: Ticket[];
}

export default function LandingPage({ currentUser, tickets }: Props) {
  return (
    <div className="container">
      <div className="row">
        {tickets?.map((tk, i) => {
          //if(tk.status === "completed") return;
          return (
            <div className="col-sm-4" key={i + 1}>
              <TicketItem ticket={tk} index={i + 1} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

LandingPage.getInitialProps = async (context: any) => {
  const client = buildClient(context);
  const { data: tickets } = await client.get("/api/tickets");

  return { tickets };
};
