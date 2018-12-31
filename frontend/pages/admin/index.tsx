import { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';
import UpdateUserContext from '../../components/UpdateUserContext';
import { UserContext } from '../../context';

class Index extends Component {
  static contextType = UserContext;

  render() {
    const { categories } = this.context;
    const { id: lastCategoryId } = categories[categories.length - 1];
    return (
      <FullHeightContainer>
        <UpdateUserContext since={lastCategoryId}>
          <AdminLayout selectedKey="dashboard">
            this is the dashboard
          </AdminLayout>
        </UpdateUserContext>
      </FullHeightContainer>
    );
  }
}

export default withAuth(Index);
