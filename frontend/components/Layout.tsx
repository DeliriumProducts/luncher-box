import { Affix, Layout as AntDesignLayout } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import AdminMenuBar from './AdminMenuBar';

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
  padding: 50px;
  margin-bottom: 50px;
  height: auto;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const CustomFooter = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const Layout: React.FunctionComponent<Props> = props => {
  console.log(props.route);
  return (
    <StyledLayout>
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
    </StyledLayout>
  );
};

export default Layout;
