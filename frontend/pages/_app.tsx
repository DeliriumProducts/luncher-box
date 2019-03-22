import { PageTransition } from 'next-page-transitions';
import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import AdminContextProvider from '../components/AdminContextProvider';
import CustomerContextProvider from '../components/CustomerContextProvider';
import Layout from '../components/Layout';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    height: auto;
    min-height: 100%;
    scroll-behavior: smooth;
  }

  body {
    min-height: 100%;
    height: initial;
    background-image: url('/static/circles-primary.svg'),
    url('/static/circles-accent.svg');
    background-repeat: repeat-y;
    background-size: 85vmax, 65vmax;
    background-position: bottom -20vmax left -60vmax, top -10vmax right -36vmax;

    @media screen and (max-width: 768px) {
      background-position: bottom -10vmax left -60vmax, top -80vmax right -36vmax;
      background-size: 80vmax, 100%;
    }
  }

  * {
    box-sizing: border-box;
  }

  #__next,
  #__next > div {
    height: 100%;
    min-height: 100%;
  }

  .page-transition-enter {
    opacity: 0;
  }

  .page-transition-enter-active {
    opacity: 1;
    transition: opacity 100ms;
  }

  .page-transition-exit {
    opacity: 1;
  }

  .page-transition-exit-active {
    opacity: 0;
    transition: opacity 100ms;
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
      <>
        <Head>
          <title>LuncherBox | Place orders from your phone!</title>
        </Head>
        <CustomerContextProvider>
          <AdminContextProvider>
            <Container>
              <GlobalStyle />
              <Layout route={this.props.router.route}>
                <PageTransition timeout={150} classNames="page-transition">
                  <Component key={this.props.router.route} {...pageProps} />
                </PageTransition>
              </Layout>
            </Container>
          </AdminContextProvider>
        </CustomerContextProvider>
      </>
    );
  }
}
