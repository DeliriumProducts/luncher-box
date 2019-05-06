import { Affix, Layout as AntDesignLayout } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import MenuBar from '../components/MenuBar';

const { Content } = AntDesignLayout;

interface Props {
  route: string;
  type: 'admin' | 'customer';
  children?: ReactNode;
}

const StyledLayout = styled(AntDesignLayout)`
  min-height: 100%;
  background: rgba(0, 0, 0, 0);
`;

const StyledContent = styled(Content)`
  padding: 50px;
  height: auto;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const Layout: React.FunctionComponent<Props> = props => {
  const { route, type } = props;
  if (route === '/login' || route === '/register' || route === '/') {
    return <>{props.children}</>;
  }

  return (
    <StyledLayout>
      <Affix offsetTop={0}>
        <MenuBar type={type} selectedKey={props.route} />
      </Affix>
      <StyledContent>{props.children}</StyledContent>
    </StyledLayout>
  );
};

export default Layout;
