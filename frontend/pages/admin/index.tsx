import { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import UpdateUserContext from '../../components/UpdateUserContext';
import withAuth from '../../components/withAuth';
import { EntityContext } from '../../context';

class Index extends Component {
  static contextType = EntityContext;

  render() {
    const { categories } = this.context;
    const { id: lastCategoryId } = categories[categories.length - 1];
    return (
      <FullHeightContainer>
        <UpdateUserContext since={lastCategoryId}>
          <AdminLayout selectedKey="home">
            this is the home page <br /> dasdasdda
          </AdminLayout>
        </UpdateUserContext>
      </FullHeightContainer>
    );
  }
}

export default withAuth(Index);
