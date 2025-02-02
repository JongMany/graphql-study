import "./index.scss";

const App = ({ Component, pageProps }) => <Component {...pageProps} />;

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

export default App;
