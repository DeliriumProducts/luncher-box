import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import AdminMenuBar from './AdminMenuBar';
import styled from 'styled-components';

const { Content } = Layout;

interface Props {
  selectedKey: string;
  children?: ReactNode;
}

const CustomHeader = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledContent = styled(Content)`
  padding: 50px;
  min-height: 100%;
  background-color: #fff;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const CustomFooter = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const AdminLayout: React.FunctionComponent<Props> = props => {
  return (
    <Layout>
      <CustomHeader>
        <Affix offsetTop={0}>
          <AdminMenuBar selectedKey={props.selectedKey} />
        </Affix>
      </CustomHeader>
      <StyledContent>{props.children}</StyledContent>
      <Affix offsetBottom={0}>
        <CustomFooter>
          <AdminMenuBar selectedKey={props.selectedKey} />
        </CustomFooter>
      </Affix>
    </Layout>
  );
};
export default AdminLayout;
