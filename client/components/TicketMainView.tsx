import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import React, { useState } from "react";
import Client from "../api/build-client";
import { Ticket } from "../components/TicketItem";
import useRequest from "../hooks/use-request";
interface Props {
  ticket: Ticket;
  success: (data: any) => void;
}

export const TicketMainView = ({
  ticket: { title, price, id },
  success,
}: Props) => {
  const { doRequest, errors } = useRequest({
    body: { ticketId: id },
    method: "post",
    onSuccess: success,
    url: "/api/orders",
  });

  return (
    <div className="card mb-3">
      {errors}
      <img
        className="card-img-top"
        src="https://source.unsplash.com/300x300/?concert"
        alt="Card image cap"
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{price}</p>
        {/* <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p> */}
      </div>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => {
          doRequest();
        }}
      >
        Purchase
      </button>
    </div>
  );
};
