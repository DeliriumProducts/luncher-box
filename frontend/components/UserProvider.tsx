import React, { Component } from 'react';
import { UserContext } from '../context';
import { Category } from '../interfaces';
import { CategoryAPI } from '../api';

interface Props {
  categories: Category[];
  children: React.ReactNode;
}

interface State {
  categories: Category[];
}
class UserProvider extends Component<Props, State> {
  state = {
    categories: []
  };

  updateCategories = async () => {
    const categories = await CategoryAPI.getAll();
    this.setState({ categories });
  };

  /**
   * We update the current state for every render
   */

  render() {
    const { categories } = this.state;
    return (
      <UserContext.Provider
        value={{
          categories,
          actions: { updateCategories: this.updateCategories }
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

// then make a consumer which will surface it
const UserConsumer = UserContext.Consumer;

export default UserProvider;
export { UserConsumer };
