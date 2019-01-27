import React from 'react';
import App, { Container, NextAppContext } from 'next/app';
import { createGlobalStyle } from 'styled-components';
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

  #__next,
  #__next > div {
    height: 100%;
  }

  .page-transition-enter {
    opacity: 0;
  }

  .page-transition-enter-active {
    opacity: 1;
    transition: opacity 150ms;
  }

  .page-transition-exit {
    opacity: 1;
  }

  .page-transition-exit-active {
    opacity: 0;
    transition: opacity 150ms;
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
            <PageTransition timeout={150} classNames="page-transition">
              <Component key={this.props.router.route} {...pageProps} />
            </PageTransition>
          </Container>
        </EntityContextProvider>
      </CartContextProvider>
    );
  }
}
