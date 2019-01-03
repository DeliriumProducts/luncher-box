import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import AdminMenuBar from './AdminMenuBar';

const { Content } = Layout;

interface Props {
  selectedKey: string;
  children?: ReactNode;
}

const AdminLayout: React.FunctionComponent<Props> = props => {
  return (
    <Layout>
      <Affix offsetTop={0}>
        <AdminMenuBar selectedKey={props.selectedKey} />
      </Affix>
      <Content>
        <div style={{ minHeight: '100%', padding: '0 10px 5px 10px' }}>
          {props.children}
        </div>
      </Content>
    </Layout>
  );
};
export default AdminLayout;
