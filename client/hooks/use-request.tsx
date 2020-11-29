import { useState } from "react";
import axios, { AxiosInstance } from "axios";

interface Args {
  url: string;
  method: keyof AxiosInstance;
  body: Object;
  onSuccess: Function;
}

const useRequest = ({ url, method, body, onSuccess }: Args) => {
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const doRequest = async (extraArgs?: Object) => {
    try {
      setErrors(null);
      const response = await (axios[method] as any)(url, {
        ...body,
        ...extraArgs,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err: { message: string }) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
