import { NextComponentClass, NextContext, NextFunctionComponent } from 'next';
import Router from 'next/router';
import React, { Component } from 'react';
import { AuthAPI } from '../api';

const withAuth = <T extends object>(
  C: NextFunctionComponent<T> | NextComponentClass<T>
) =>
  class extends Component<T> {
    static async getInitialProps(ctx: NextContext) {
      const { req, res } = ctx;

      let isAuthenticated = false;

      /**
       * Check wheter authentication is happening server-side or client-side based on received context
       */
      if (req && res) {
        if (req.headers.cookie) {
          isAuthenticated = await AuthAPI.isAuthenticated(req.headers.cookie);
        }

        if (!isAuthenticated) {
          res.writeHead(302, {
            Location: '/login'
          });
          res.end();
        }
      } else {
        isAuthenticated = await AuthAPI.isAuthenticated();

        if (!isAuthenticated) {
          Router.replace('/login');
        }
      }

      /**
       * Call the getInitalProps of the wrapped component
       */
      const composedInitialProps = C.getInitialProps
        ? await C.getInitialProps(ctx)
        : {};

      return {
        ...composedInitialProps
      };
    }
    render() {
      return <C {...this.props} />;
    }
  };

export default withAuth;
