import React from 'react';
import App, { Container } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import AdminContext from '../context/AdminContext';
import UserContext from '../context/UserContext';

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
}

export default class MyApp extends App<Props> {
  static async getInitialProps({ Component, ctx, req, res }: any) {
    let pageProps = {};
    let categories = {};
    let isAuthenticated = false;
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    /**
     * Check for authentication
     */
    if (req) {
      if (req.headers.cookie) {
        const response = await axios.get('http://localhost:8000/auth', {
          withCredentials: true,
          headers: {
            cookie: req.headers.cookie
          }
        });
        isAuthenticated = response.data;
      }

      if (!isAuthenticated) {
        res.writeHead(302, {
          Location: '/login'
        });
        res.end();
      }
    }

    return { pageProps, isAuthenticated };
  }

  render() {
    const { Component, pageProps, isAuthenticated } = this.props;

    return (
      <AdminContext.Provider value={{ isAuthenticated }}>
        <Container>
          <GlobalStyle />
          <Component {...pageProps} />
        </Container>
      </AdminContext.Provider>
    );
  }
}
