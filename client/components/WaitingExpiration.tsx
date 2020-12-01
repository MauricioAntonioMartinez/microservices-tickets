import React from "react";
import { useRouter } from "next/router";

interface Props {
  orderId: string;
}

export const WaitingExpiration = ({ orderId }: Props) => {
  const router = useRouter();

  return (
    <div
      className="alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      <strong>Holy guacamole!</strong> You should purchase the ticket under the
      1 minute mark
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => {
          router.push("/purchase/[purchaseId]", `/purchase/${orderId}`);
        }}
      >
        Purchase Now
      </button>
    </div>
  );
};
