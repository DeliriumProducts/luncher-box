import React, { Component, Fragment } from 'react';
import { Category } from '../interfaces';
import { CategoryAPI } from '../api';
import { AdminContext } from '../context';

interface Props {
  since?: number;
  children: React.ReactNode;
}

interface State {
  categories: Category[];
}

class UpdateUserContext extends Component<Props, State> {
  static contextType = AdminContext;

  async componentDidMount() {
    const { since } = this.props;
    let categories: Category[];
    if (since) {
      categories = await CategoryAPI.getAll(since);
      this.context.actions.addCategories(categories);
    } else {
      categories = await CategoryAPI.getAll();
      this.context.actions.updateCategories();
    }
  }
  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

export default UpdateUserContext;
