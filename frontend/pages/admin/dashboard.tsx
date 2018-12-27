import Layout from '../../components/Layout';
import FullHeightContainer from '../../components/FullHeightContainer';
import Index from './index';

class Dashboard extends Index {
  render() {
    return (
      <FullHeightContainer>
        <Layout selectedKey="dashboard">this is the dashboard</Layout>
      </FullHeightContainer>
    );
  }
}

export default Dashboard;
