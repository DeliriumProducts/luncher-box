import React, { Component, Fragment } from 'react';
import { Category } from '../interfaces';
import { CategoryAPI } from '../api';
import { UserContext } from '../context';

interface Props {
  since?: number;
  children: React.ReactNode;
}

interface State {
  categories: Category[];
}

class UpdateUserContext extends Component<Props, State> {
  static contextType = UserContext;

  state = {
    categories: []
  };

  async componentDidMount() {
    const { since } = this.props;
    let categories: Category[];
    if (since) {
      categories = await CategoryAPI.getAll(since);
      this.setState({ categories });
    } else {
      categories = await CategoryAPI.getAll();
      this.setState({ categories });
    }

    this.context.actions.addCategories(categories);
  }
  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

export default UpdateUserContext;
