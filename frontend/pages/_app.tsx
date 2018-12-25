import React from 'react';
import App, { Container, NextAppContext } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { UserContext } from '../context/';
import { Category } from '../types';
import { AuthAPI, CategoryAPI } from '../api';
import { NextContext } from 'next';

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

    /**
     * Get all categories
     */
    const categories = await CategoryAPI.getAll();
    return { pageProps, categories };
  }

  render() {
    const { Component, pageProps, isAuthenticated, categories } = this.props;

    return (
      <UserContext.Provider value={{ categories }}>
        <Container>
          <GlobalStyle />
          <Component {...pageProps} />
        </Container>
      </UserContext.Provider>
    );
  }
}
