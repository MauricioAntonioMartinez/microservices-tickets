import axios from "axios";
import { NextPageContext } from "next";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import { useRouter } from "next/router";
import { toASCII } from "punycode";
import React, { useEffect, useState } from "react";
import StripeCheckout, { Token } from "react-stripe-checkout";
import { clearInterval } from "timers";
import Client from "../../api/build-client";
import useRequest from "../../hooks/use-request";
import { CurrentUser } from "../_app";

export interface Order {
  id: string;
  ticket: {
    title: string;
    price: number;
  };
  price: number;
  status: string;
  userId: string;
  expiresAt: number;
}

interface Props {
  order: Order;
  currentUser: CurrentUser;
}

const STRIPE_PUBLISH_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY!;

const Purchase = ({ order, currentUser }: Props) => {
  const router = useRouter();
  const [timeToPurchase, setTimeToPurchase] = useState(
    Math.ceil(order.expiresAt / 1000)
  );
  const [alert, setAlert] = useState<JSX.Element | null>(null);

  const { errors, doRequest } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment: any) => {
      setAlert(
        <div className="alert alert-success" role="alert">
          "Successfully Paid"
        </div>
      );

      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeToPurchase <= 0) window.clearTimeout(interval);
      setTimeToPurchase((time) => time - 1);
    }, 1000);
  }, []);
  const onToken = (token: Token) => doRequest({ token: token.id });

  if (alert) return alert;

  return (
    <div className="container">
      {errors}
      {timeToPurchase <= 0 ? (
        <strong>Order Expired :(</strong>
      ) : (
        <>
          <strong>Time left for purchase:</strong> {timeToPurchase} seconds
          <StripeCheckout
            token={onToken}
            stripeKey={STRIPE_PUBLISH_KEY}
            amount={order?.ticket?.price || 0 * 100}
            email={currentUser.email}
          />
        </>
      )}
    </div>
  );
};

Purchase.getInitialProps = async (ctx: NextPageContext, axios: any) => {
  const res = await axios.get(`/api/orders/${ctx.query.purchaseId}`);
  const currentDate = new Date();
  return {
    order: {
      ...res?.data,
      expiresAt: +new Date(res?.data?.expiresIn) - +currentDate,
    },
  };
};

export default Purchase;
