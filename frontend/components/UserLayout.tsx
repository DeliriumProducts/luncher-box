import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import UserMenuBar from './UserMenuBar';
import styled from 'styled-components';

const { Content } = Layout;

const { Content } = Layout;

interface Props {
  selectedKey: string;
  children?: ReactNode;
  img?: string;
}

const StyledContent = styled(Content)`
  padding: 50px;
  @media (max-width: 768px) {
    padding: 20px;
    padding-bottom: 50px;
  }
`;

const CustomHeader = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const CustomFooter = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const UserLayout: React.FunctionComponent<Props> = props => {
  return (
    <Layout>
      <CustomHeader>
        <Affix offsetTop={0}>
          <UserMenuBar selectedKey={props.selectedKey} />
        </Affix>
      </CustomHeader>
      <StyledContent>{props.children}</StyledContent>
      <Affix offsetBottom={0}>
        <CustomFooter>
          <UserMenuBar selectedKey={props.selectedKey} />
        </CustomFooter>
      </Affix>
    </Layout>
  );
};
export default UserLayout;
