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

  addCategory = (category: Category) => {
    this.setState({ category });
  };

  addCategories = (newCategories: Category[]) => {
    /**
     * This code should be reviewed later on!
     */
    let categories: Category[] = { ...this.state.categories };
    categories = { ...categories, ...newCategories };
    this.setState({ categories });
  };

  componentDidMount() {
    const { categories } = this.props;
    this.setState({ categories });
  }

  /**
   * We update the current context for every render
   */

  render() {
    const { category, categories: currentCategories } = { ...this.state };

    const categories: Category[] = category
      ? [...currentCategories, category]
      : [...currentCategories];
    return (
      <UserContext.Provider
        value={{
          categories,
          actions: {
            updateCategories: this.updateCategories,
            addCategory: this.addCategory,
            addCategories: this.addCategories
          }
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
