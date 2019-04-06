import { NextComponentClass, NextContext, NextFunctionComponent } from 'next';
import React, { Component } from 'react';

/**
 * Alternative to the withRouter from next/router, until it gets migrated to the new context API.
 * It is to be used when you don't want / need the getInitalProps function, as this overrides it.
 */
const withRouter = <T extends object>(
  C: NextFunctionComponent<T> | NextComponentClass<T>
) =>
  class extends Component<T> {
    static async getInitialProps(ctx: NextContext) {
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

export default withRouter;
