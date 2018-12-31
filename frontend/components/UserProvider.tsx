import React, { Component } from 'react';
import { UserContext } from '../context';
import { Category } from '../interfaces';

interface Props {
  categories: Category[];
  children: React.ReactNode;
}

interface State {
  category: Category | undefined;
}
class UserProvider extends Component<Props, State> {
  state = {
    category: undefined
  };
  addCategory = (category: Category) => {
    this.setState({ category });
  };

  /**
   * We update the current state for every render
   */

  render() {
    const { category } = this.state;
    const categories = category
      ? [...this.props.categories, category]
      : [...this.props.categories];
    return (
      <UserContext.Provider
        value={{
          categories,
          actions: { addCategory: this.addCategory }
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
