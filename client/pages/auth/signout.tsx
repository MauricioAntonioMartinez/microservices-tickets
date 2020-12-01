import React from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
interface Props {}

export default function SignOut(props: Props) {
  const { doRequest } = useRequest({
    body: {},
    method: "post",
    onSuccess: () => Router.push("/"),
    url: "/api/users/signout",
  });

  React.useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out.</div>;
}
