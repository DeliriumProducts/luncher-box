import { Affix } from 'antd';
import React, { ReactNode } from 'react';
import MenuBar from './MenuBar';

interface Props {
  selectedKey: string;
  children: ReactNode;
}

const Layout: React.FunctionComponent<Props> = props => {
  return (
    <>
      <Affix offsetTop={0}>
        <MenuBar selectedKey={props.selectedKey} />
      </Affix>
      {props.children}
    </>
  );
};
export default Layout;
