import { Affix, Layout as AntDesignLayout } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import MenuBar from './MenuBar';

const { Content } = AntDesignLayout;

interface Props {
  route: string;
  children?: ReactNode;
}

const StyledLayout = styled(AntDesignLayout)`
  min-height: 100%;
  background: rgba(0, 0, 0, 0);
`;

const StyledContent = styled(Content)`
  padding: 50px;
  margin-bottom: 47px;
  height: auto;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const Layout: React.FunctionComponent<Props> = props => {
  if (
    props.route === '/login' ||
    props.route === '/register' ||
    props.route === '/'
  ) {
    return <>{props.children}</>;
  }

  const type = props.route.startsWith('/admin') ? 'admin' : 'customer';

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
