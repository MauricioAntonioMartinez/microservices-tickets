import { useState, useEffect, FormEvent } from "react";
import Router from "next/router";
import useRequest from "../hooks/use-request";

export default function UserForm({
  endPoint,
  push,
  title,
}: {
  endPoint: string;
  push: string;
  title: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: `/api/users/${endPoint}`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push(push),
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{title}</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
}
