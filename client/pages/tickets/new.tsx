import axios from "axios";
import React, { MutableRefObject, RefObject, useRef, useState } from "react";
import { CurrentUser } from "../_app";

interface Props {
  currentUser?: CurrentUser;
}

const NewTicket = ({ currentUser }: Props) => {
  if (!currentUser)
    return (
      <div className="container">
        <h1> Must be authenticated for adding a ticket</h1>
      </div>
    );

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const refTitle = useRef<any>();
  const refPrice = useRef<any>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const title = refTitle.current.value;
      const price = +refPrice.current.value;

      const errors = [];
      if (title.length < 5) errors.push("Title too short");
      if (typeof price !== "number") errors.push("Must me a number the price");
      if (price < 0) errors.push("Must be positive");
      if (errors.length > 0) throw new Error(errors.map((e) => e).toString());

      const res = await axios.post("/api/tickets", {
        title: refTitle.current.value,
        price: +refPrice.current.value,
      });

      setAlert(
        <div className="alert alert-success" role="alert">
          "Successfully Created"
        </div>
      );
    } catch (e) {
      setAlert(
        <div className="alert alert-danger" role="alert">
          {e.message}
        </div>
      );
    }
  };

  return (
    <div className="container">
      {alert}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input
            ref={refTitle}
            type="text"
            className="form-control"
            id="title"
            aria-describedby="ticket"
            placeholder="Ticket title"
          />
          <small id="title" className="form-text text-muted">
            Share the title of the concert
          </small>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            ref={refPrice}
            type="number"
            className="form-control"
            id="price"
            aria-describedby="priceHelp"
            placeholder="Enter the ticket price"
          />
          <small id="price" className="form-text text-muted">
            Give a price to your ticket
          </small>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
