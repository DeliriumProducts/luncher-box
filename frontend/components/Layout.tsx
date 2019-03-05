import { Affix, Layout as AntDesignLayout } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import MenuBar from './MenuBar';

const { Content } = AntDesignLayout;

interface Props {
  selectedKey: string;
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
  margin-bottom: 47px;
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
  if (props.selectedKey === '/login' || props.selectedKey === '/register') {
    return <>{props.children}</>;
  }

  return (
    <StyledLayout>
      <CustomHeader>
        <Affix offsetTop={0}>
          <MenuBar selectedKey={props.selectedKey} />
        </Affix>
      </CustomHeader>
      <StyledContent>{props.children}</StyledContent>
      <Affix offsetBottom={0}>
        <CustomFooter>
          <MenuBar selectedKey={props.selectedKey} />
        </CustomFooter>
      </Affix>
    </StyledLayout>
  );
};

export default Layout;
