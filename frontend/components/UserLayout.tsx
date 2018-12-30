import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import UserMenuBar from './UserMenuBar';
import styled from 'styled-components';

interface Props {
  selectedKey: string;
  children?: ReactNode;
  img: string;
}

const UserLayout: React.FunctionComponent<Props> = props => {
  return (
    <>
      <Affix offsetTop={0}>
        <UserMenuBar selectedKey={props.selectedKey} />
      </Affix>
      {props.children}
    </>
  );
};
export default UserLayout;
