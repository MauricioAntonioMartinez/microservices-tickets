import type { AppContext, AppProps /*, AppContext */ } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import axios from "../api/build-client";
import Header from "../components/header";
import { AppContextType } from "next/dist/next-server/lib/utils";

export interface CurrentUser {
  email: string;
  id: string;
}

interface props {
  props: AppProps;
  currentUser: CurrentUser;
}

export default function AppComponent({
  Component,
  pageProps,
  currentUser,
}: any) {
  const props = { ...pageProps, currentUser };
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...props} />
      </div>
    </div>
  );
}

AppComponent.getInitialProps = async (appContext: any) => {
  const { data } = await axios(appContext.ctx).get("/api/users/currentUser");
  let pageProps = {};
  if (appContext.Component.getInitialProps)
    // if ssr
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      axios(appContext.ctx),
      data.currentUser
    ); // manually call get initial props from the component rendered

  return {
    pageProps,
    ...data,
  };
};
