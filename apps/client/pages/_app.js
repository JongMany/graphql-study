import { useRef } from "react";

import "./index.scss";
import {
  QueryClientProvider,
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

const App = ({ Component, pageProps }) => {
  const clientRef = useRef(null);

  const getClient = () => {
    if (!clientRef.current) {
      clientRef.current = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      });
    }
    return clientRef.current;
  };

  return (
    <QueryClientProvider client={getClient()}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

export default App;
