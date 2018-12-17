import Layout from '../components/Layout';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
`;

const Dashboard = () => {
  return (
    <Container>
      <Layout selectedKey="dashboard" />
    </Container>
  );
};

export default Dashboard;
