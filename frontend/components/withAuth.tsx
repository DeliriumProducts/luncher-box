import React from 'react';
import { NextContext } from 'next';
import { AuthAPI } from '../api';
import Router from 'next/router';

const withAuth = <T extends object>(C: React.ComponentClass<T>) => {
  return class AuthComponent extends React.Component<T> {
    static async getInitialProps({ req, res }: NextContext) {
      let isAuthenticated = false;

      /**
       * Check for authentication
       */

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
          Router.push('/login');
        }
      }

      return { isAuthenticated };
    }
    render() {
      return <C {...this.props} />;
    }
  };
};

export default withAuth;
