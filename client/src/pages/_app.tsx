import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {/* <ColorModeProvider
        options={{
          useSystemColorMode: false,
        }}
      > */}
      <Head>
        <title>Collections</title>
      </Head>
      <Component {...pageProps} />
      {/* </ColorModeProvider> */}
    </ChakraProvider>
  );
}

export default MyApp;
