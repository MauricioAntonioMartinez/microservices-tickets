import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import React, { useState } from "react";
import Client from "../../api/build-client";
import { Ticket } from "../../components/TicketItem";
import { TicketMainView } from "../../components/TicketMainView";
import { WaitingExpiration } from "../../components/WaitingExpiration";
import useRequest from "../../hooks/use-request";
interface Props {
  ticket: Ticket;
}

export const TicketPage = ({ ticket }: Props) => {
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState("");

  switch (step) {
    case 0:
      return (
        <TicketMainView
          ticket={ticket}
          success={(response) => {
            setOrderId(response.id);
            setStep((r) => r + 1);
          }}
        />
      );
      break;
    case 1:
      return <WaitingExpiration orderId={orderId} />;
      break;
  }
};

export default TicketPage;

TicketPage.getInitialProps = async (ctx: NextPageContext) => {
  const ticketId = ctx.query.ticketId;
  const { data } = await Client({ req: ctx.req }).get(
    `/api/tickets/${ticketId}`
  );

  return { ticket: data };
};
