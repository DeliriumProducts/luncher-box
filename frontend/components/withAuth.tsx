import { NextComponentClass, NextContext, NextFunctionComponent } from 'next';
import Router, { SingletonRouter } from 'next/router';
import React, { Component, ComponentType } from 'react';
import { StaffAPI } from '../api';
import { AdminContext } from '../context';
import { User } from '../interfaces';
import { Role } from '../types';

const withAuth = <T extends object>(
  C: NextFunctionComponent<T> | NextComponentClass<T>,
  roles: Role[] = []
): ComponentType<T & { router: SingletonRouter; user: User }> =>
  class extends Component<T & { router: SingletonRouter; user: User }> {
    static contextType = AdminContext;

    static async getInitialProps(ctx: NextContext) {
      const { req, res } = ctx;

      let auth: { user: User | null; isAuthenticated: boolean } = {
        user: null,
        isAuthenticated: false
      };

      /**
       * Check wheter authentication is happening server-side or client-side based on received context
       */
      if (req && res) {
        if (req.headers.cookie) {
          auth = await StaffAPI.isAuthenticated(req.headers.cookie);
        }

        if (!auth.isAuthenticated) {
          res.writeHead(302, {
            Location: '/login'
          });

          res.end();
        } else if (
          roles.length &&
          auth.user &&
          auth.user.role !== 'Admin' &&
          !roles.includes(auth.user.role)
        ) {
          res.writeHead(302, {
            Location: '/admin'
          });

          res.end();
        }
      } else {
        auth = await StaffAPI.isAuthenticated();

        if (!auth.isAuthenticated) {
          Router.replace('/login');
        } else if (
          roles.length &&
          auth.user &&
          auth.user.role !== 'Admin' &&
          !roles.includes(auth.user.role)
        ) {
          Router.replace('/admin');
        }
      }

      /**
       * Call the getInitalProps of the wrapped component
       */
      const composedInitialProps = C.getInitialProps
        ? await C.getInitialProps(ctx)
        : {};

      return {
        ...composedInitialProps,
        user: auth.user
      };
    }

    context!: React.ContextType<typeof AdminContext>;

    componentDidMount() {
      this.context.dispatch({ type: 'setUser', payload: this.props.user });
    }

    render() {
      return <C {...this.props} />;
    }
  };

export default withAuth;
