import React, { Component } from 'react';
import { EntityContext } from '../context';
import { Category } from '../interfaces';
import { CategoryAPI } from '../api';

interface Props {
  children: React.ReactNode;
}

interface State {
  categories: Category[];
  category: Category | undefined;
}
class UserProvider extends Component<Props, State> {
  state = {
    categories: [],
    category: undefined
  };

  updateCategories = async () => {
    const categories = await CategoryAPI.getAll();
    this.setState({ categories });
  };

  addCategories = (newCategories: Category[]) => {
    let categories: Category[] = [...this.state.categories];
    categories = [...categories, ...newCategories];
    this.setState({ categories });
  };

  addCategory = (newCategory: Category) => {
    this.setState({ category: newCategory });
  };

  /**
   * We update the current context for every render
   */
  render() {
    const { categories: currentCategories } = this.state;
    const categories: Category[] = [...currentCategories];
    return (
      <EntityContext.Provider
        value={{
          categories,
          actions: {
            updateCategories: this.updateCategories,
            addCategories: this.addCategories,
            addCategory: this.addCategory
          }
        }}
      >
        {this.props.children}
      </EntityContext.Provider>
    );
  }
}

// then make a consumer which will surface it
const UserConsumer = EntityContext.Consumer;

export default UserProvider;
export { UserConsumer };
