import Layout from '../../components/Layout';
import styled from 'styled-components';
import Index from './index';

const Container = styled.div`
  height: 100%;
`;

class Dashboard extends Index {
  render() {
    return (
      <Container>
        <Layout selectedKey="dashboard" />
      </Container>
    );
  }
}

export default Dashboard;
