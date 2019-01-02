import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import AdminMenuBar from './AdminMenuBar';
import styled from 'styled-components';

const { Header, Footer, Sider, Content } = Layout;

interface Props {
  selectedKey: string;
  children?: ReactNode;
}

const AdminLayout: React.FunctionComponent<Props> = props => {
  return (
    <>
      <Layout>
        <Affix offsetTop={0}>
          <AdminMenuBar selectedKey={props.selectedKey} />
        </Affix>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ padding: 24, minHeight: 280 }}>{props.children}</div>
        </Content>
      </Layout>
    </>
  );
};
export default AdminLayout;
