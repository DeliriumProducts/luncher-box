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
    static async getInitialProps({ query }: NextContext) {
      return {
        query
      };
    }

    render() {
      return <C {...this.props} />;
    }
  };

export default withRouter;
