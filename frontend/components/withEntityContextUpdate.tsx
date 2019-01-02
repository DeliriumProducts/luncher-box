import React, { Component, Fragment } from 'react';
import { Category } from '../interfaces';
import { CategoryAPI } from '../api';
import { EntityContext } from '../context';

interface Props {
  since?: number;
  children: React.ReactNode;
}

interface State {
  categories: Category[];
}

const withEntityContextUpdate = <T extends Props>(C: React.ComponentClass<T>) =>
  class extends Component<T, State> {
    static contextType = EntityContext;

    async componentDidMount() {
      const { since } = this.props;
      let categories: Category[];
      if (since) {
        categories = await CategoryAPI.getAll(since);
        this.context.actions.addCategories();
      } else {
        categories = await CategoryAPI.getAll();
      }
    }
    render() {
      return <C {...this.props} />;
    }
  };

export default withEntityContextUpdate;
