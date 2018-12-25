import React from 'react';
import App, { Container } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import AdminContext from '../context/AdminContext';
import UserContext from '../context/UserContext';
import { Category } from '../types';

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
  static async getInitialProps({ Component, ctx, req, res }: any) {
    let pageProps = {};
    let isAuthenticated = false;
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    /**
     * Check for authentication
     */
    if (req) {
      if (req.headers.cookie) {
        isAuthenticated = (await axios.get('http://80ee1d03.ngrok.io/auth', {
          withCredentials: true,
          headers: {
            cookie: req.headers.cookie
          }
        })).data;
      }

      if (!isAuthenticated) {
        res.writeHead(302, {
          Location: '/login'
        });
        res.end();
      }
    }

    /**
     * Get all categories
     */
    const categories = (await axios.get('http://80ee1d03.ngrok.io')).data;
    return { pageProps, isAuthenticated, categories };
  }

  render() {
    const { Component, pageProps, isAuthenticated, categories } = this.props;

    return (
      <AdminContext.Provider value={{ isAuthenticated }}>
        <UserContext.Provider value={{ categories }}>
          <Container>
            <GlobalStyle />
            <Component {...pageProps} />
          </Container>
        </UserContext.Provider>
      </AdminContext.Provider>
    );
  }
}
