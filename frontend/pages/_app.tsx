import React from 'react';
import App, { Container, NextAppContext } from 'next/app';
import styled, { createGlobalStyle } from 'styled-components';
import { PageTransition } from 'next-page-transitions';
import EntityContextProvider from '../components/AdminContextProvider';
import CartContextProvider from '../components/CartContextProvider';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  #__next {
    height: 100%;
  }

  .page-transition-enter {
    height: 100%;
    opacity: 0;
  }

  .page-transition-enter-active {
    height: 100%;
    opacity: 1;
    transition: opacity 300ms;
  }

  .page-transition-exit {
    height: 100%;
    opacity: 1;
  }

  .page-transition-exit-active {
    height: 100%;
    opacity: 0;
    transition: opacity 300ms;
  }

  .page-transition-enter-done {
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
            <PageTransition timeout={200} classNames="page-transition">
              <Component {...pageProps} />
            </PageTransition>
          </Container>
        </EntityContextProvider>
      </CartContextProvider>
    );
  }
}
