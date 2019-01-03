import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import UserMenuBar from './UserMenuBar';
import styled from 'styled-components';

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
  }
`;

const UserLayout: React.FunctionComponent<Props> = props => {
  return (
    <Layout>
      <Affix offsetTop={0}>
        <UserMenuBar selectedKey={props.selectedKey} />
      </Affix>
      <StyledContent>{props.children}</StyledContent>
    </Layout>
  );
};
export default UserLayout;
