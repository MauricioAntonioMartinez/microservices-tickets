import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import React from "react";
import { Order } from "../purchase/[purchaseId]";

interface Props {
  orders: Order[];
}

const Orders = ({ orders }: Props) => {
  console.log(orders);
  return (
    <div className="container">
      <h1>My Orders </h1>
      <ul className="list-group">
        {orders?.map((order) => {
          return (
            <li className="list-group-item d-flex justify-content-between align-items-center">
              {order?.ticket.title} - ${order.ticket.price}
              <span className="badge badge-primary badge-pill">{order.id}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Orders.getInitialProps = async (ctx: NextPageContext, axios: AxiosInstance) => {
  const res = await axios.get("/api/orders");

  return {
    orders: res.data,
  };
};

export default Orders;
