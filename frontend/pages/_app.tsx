import { PageTransition } from 'next-page-transitions';
import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import '../assets/nprogress.less';
import {
  AdminContextProvider,
  CustomerContextProvider,
  SocketContextProvider
} from '../context';
import { AdminLayout } from '../layouts';
import { CustomerLayout } from '../layouts/';

/**
 * https://github.com/zeit/next.js/tree/canary/examples/with-loading
 */

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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
    font-family: Montserrat, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #fafafa;
  border-radius: 7px;
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);

  margin-right: 10%;
  margin-left: 10%;

  @media (max-width: 480px) {
    border-radius: 0;
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
    let type: 'admin' | 'customer';

    type = this.props.router.route.startsWith('/admin') ? 'admin' : 'customer';

    return (
      <>
        <Head>
          <title>LuncherBox • Place orders from your phone!</title>
        </Head>
        <SocketContextProvider>
          {type === 'customer' ? (
            <CustomerContextProvider>
              <Container>
                <GlobalStyle />
                <CustomerLayout type="customer" route={this.props.router.route}>
                  <PageTransition timeout={150} classNames="page-transition">
                    <Component key={this.props.router.route} {...pageProps} />
                  </PageTransition>
                </CustomerLayout>
              </Container>
            </CustomerContextProvider>
          ) : (
            <AdminContextProvider>
              <Container>
                <GlobalStyle />
                <AdminLayout type="admin" route={this.props.router.route}>
                  <PageTransition timeout={150} classNames="page-transition">
                    <Component key={this.props.router.route} {...pageProps} />
                  </PageTransition>
                </AdminLayout>
              </Container>
            </AdminContextProvider>
          )}
        </SocketContextProvider>
      </>
    );
  }
}
