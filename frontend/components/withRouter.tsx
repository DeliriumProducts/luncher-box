import { NextContext } from 'next';
import React, { Component, ComponentClass } from 'react';

/**
 * Alternative to the withRouter from next/router, until it gets migrated to the new context API
 */
const withRouter = <T extends object>(C: ComponentClass<T>) =>
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
