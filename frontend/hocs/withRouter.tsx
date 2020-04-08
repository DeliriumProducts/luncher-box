import { NextPageContext, NextPage } from 'next';
import { SingletonRouter } from 'next/router';
import React, { Component, ComponentType } from 'react';

/**
 * Alternative to the withRouter from next/router, until it gets migrated to the new context API.
 */
export const withRouter = <T extends object>(
  C: NextPage<T>
): ComponentType<T & { router: SingletonRouter }> =>
  class extends Component<T & { router: SingletonRouter }> {
    static async getInitialProps(ctx: NextPageContext) {
      const { query } = ctx;

      /**
       * Call the getInitalProps of the wrapped component
       */
      const composedInitialProps = C.getInitialProps
        ? await C.getInitialProps(ctx)
        : {};

      return {
        ...composedInitialProps,
        query
      };
    }

    render() {
      return <C {...this.props} />;
    }
  };
