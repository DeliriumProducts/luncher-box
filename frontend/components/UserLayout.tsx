import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import UserMenuBar from './UserMenuBar';

const { Content } = Layout;

interface Props {
  selectedKey: string;
  children?: ReactNode;
  img?: string;
}

const UserLayout: React.FunctionComponent<Props> = props => {
  return (
    <Layout>
      <Affix offsetTop={0}>
        <UserMenuBar selectedKey={props.selectedKey} />
      </Affix>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ padding: 24, minHeight: 280 }}>{props.children}</div>
      </Content>
    </Layout>
  );
};
export default UserLayout;
