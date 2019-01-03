import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import AdminMenuBar from './AdminMenuBar';
import styled from 'styled-components';

const { Header, Footer, Sider, Content } = Layout;

interface Props {
  selectedKey: string;
  children?: ReactNode;
}

const StyledContent = styled(Content)`
  padding: 50px;
  min-height: 100%;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const AdminLayout: React.FunctionComponent<Props> = props => {
  return (
    <Layout>
      <Affix offsetTop={0}>
        <AdminMenuBar selectedKey={props.selectedKey} />
      </Affix>
      <StyledContent>{props.children}</StyledContent>
    </Layout>
  );
};
export default AdminLayout;
