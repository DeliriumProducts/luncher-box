import { Affix, Layout as AntDesignLayout } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import AdminMenuBar from './AdminMenuBar';
import UserMenuBar from './UserMenuBar';

const { Content } = AntDesignLayout;

interface Props {
  selectedKey: string;
  route: string;
  children?: ReactNode;
}

const StyledLayout = styled(AntDesignLayout)`
  min-height: 100%;
  background: rgba(0, 0, 0, 0);
`;

const CustomHeader = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledContent = styled(Content)`
  /* padding: 50px;
  margin-bottom: 50px;
  height: auto;

  @media (max-width: 480px) {
    padding: 0;
  } */
  min-height: 100%;
  padding: 50px;

  @media (max-width: 768px) {
    padding: 20px;
    padding-bottom: 50px;
  }
`;

const CustomFooter = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const Layout: React.FunctionComponent<Props> = props => {
  let MenuBar: React.ReactNode;

  if (props.route.startsWith('/admin')) {
    MenuBar = <AdminMenuBar selectedKey={props.route} />;
  } else {
    MenuBar = <UserMenuBar selectedKey={props.route} />;
  }

  return (
    <StyledLayout>
      <CustomHeader>
        <Affix offsetTop={0}>{MenuBar}</Affix>
      </CustomHeader>
      <StyledContent>{props.children}</StyledContent>
      <Affix offsetBottom={0}>
        <CustomFooter>{MenuBar}</CustomFooter>
      </Affix>
    </StyledLayout>
  );
};

export default Layout;
