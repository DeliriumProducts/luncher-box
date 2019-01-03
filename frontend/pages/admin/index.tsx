import { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';
import { EntityContext } from '../../context';

class Index extends Component {
  static contextType = EntityContext;
  context!: React.ContextType<typeof EntityContext>;

  componentDidMount() {
    this.context.actions.updateEntities();
  }

  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="home">
          this is the home page <br /> dasdasdda
        </AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default withAuth(Index);
