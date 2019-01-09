import App, { Container, NextAppContext } from 'next/app';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import EntityContextProvider from '../components/AdminContextProvider';
import CartContextProvider from '../components/CartContextProvider';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
  }

  #__next {
    height: 100%;
  }
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }: NextAppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <CartContextProvider>
        <EntityContextProvider>
          <Container>
            <GlobalStyle />
            <Component {...pageProps} />
          </Container>
        </EntityContextProvider>
      </CartContextProvider>
    );
  }
}
