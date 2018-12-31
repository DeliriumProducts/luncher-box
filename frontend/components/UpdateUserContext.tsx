import React, { Component, Fragment } from 'react';
import { Category } from '../interfaces';
import { CategoryAPI } from '../api';

interface Props {
  since: number;
  children: React.ReactNode;
}

interface State {
  categories: Category[];
}

class UpdateUserContext extends Component<Props, State> {
  state = {
    categories: []
  };

  async componentDidMount() {
    const { since } = this.props;
    if (since) {
      const categories = await CategoryAPI.getAll(since);
      this.setState({ categories });
    } else {
      const categories = await CategoryAPI.getAll();
      this.setState({ categories });
    }
  }
  render() {
    const { categories } = this.state;
    return <>this.props.children({categories})</>;
  }
}

export default UpdateUserContext;
