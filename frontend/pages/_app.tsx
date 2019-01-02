import App, { Container, NextAppContext } from 'next/app';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import EntityContextProvider from '../components/EntityContextProvider';
import { Category } from '../interfaces';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
  }

  #__next {
    height: 100%;
  }
`;

interface Props {
  isAuthenticated: boolean;
  categories: Category[];
}

export default class MyApp extends App<Props> {
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
      <EntityContextProvider>
        <Container>
          <GlobalStyle />
          <Component {...pageProps} />
        </Container>
      </EntityContextProvider>
    );
  }
}
