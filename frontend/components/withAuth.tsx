import { NextComponentClass, NextContext, NextFunctionComponent } from 'next';
import Router, { SingletonRouter } from 'next/router';
import React, { Component, ComponentType } from 'react';
import { EmployeeAPI } from '../api';

const withAuth = <T extends object>(
  C: NextFunctionComponent<T> | NextComponentClass<T>
): ComponentType<T & { router: SingletonRouter }> =>
  class extends Component<T & { router: SingletonRouter }> {
    static async getInitialProps(ctx: NextContext) {
      const { req, res } = ctx;

      let isAuthenticated = false;

      /**
       * Check wheter authentication is happening server-side or client-side based on received context
       */
      if (req && res) {
        if (req.headers.cookie) {
          isAuthenticated = await EmployeeAPI.isAuthenticated(
            req.headers.cookie
          );
        }

        if (!isAuthenticated) {
          res.writeHead(302, {
            Location: '/login'
          });
          res.end();
        }
      } else {
        isAuthenticated = await EmployeeAPI.isAuthenticated();

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
