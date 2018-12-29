import { Affix } from 'antd';
import React, { ReactNode } from 'react';
import AdminMenuBar from './AdminMenuBar';

interface Props {
  selectedKey: string;
  children?: ReactNode;
}

const AdminLayout: React.FunctionComponent<Props> = props => {
  return (
    <>
      <Affix offsetTop={0}>
        <AdminMenuBar selectedKey={props.selectedKey} />
      </Affix>
      {props.children}
    </>
  );
};
export default AdminLayout;
