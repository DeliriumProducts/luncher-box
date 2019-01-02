import { NextContext } from 'next';
import Router from 'next/router';
import React, { Component, ComponentClass } from 'react';
import { AuthAPI } from '../api';

const withAuth = <T extends object>(C: ComponentClass<T>) =>
  class extends Component<T> {
    static async getInitialProps({ req, res }: NextContext) {
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
          Router.push('/login');
        }
      }
    }
    render() {
      return <C {...this.props} />;
    }
  };

export default withAuth;
