import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import Index from './index';

class Dashboard extends Index {
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="dashboard">this is the dashboard</AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default Dashboard;
