import React from "react";
import Link from "next/link";

export interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  status?: string;
}

interface Props {
  ticket: Ticket;
  index: number;
}

export const TicketItem = ({
  ticket: { price, status = "Created", title, id },
  index,
}: Props) => {
  return (
    <div className="card">
      <img
        className="card-img-top"
        src={`https://source.unsplash.com/22${index}x22${index}/?concert`}
        alt="TicketImage"
      />
      <div className="card-body">
        <h5 className="card-title">
          {title} - ${price}
        </h5>
        <p className="card-text">{status}</p>
        <Link href={`/tickets/${id}`}>
          <a className="btn btn-primary">View Ticket Details</a>
        </Link>
      </div>
    </div>
  );
};
