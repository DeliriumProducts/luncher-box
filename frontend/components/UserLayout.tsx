import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import UserMenuBar from './UserMenuBar';

const { Content } = Layout;

interface Props {
  selectedKey: string;
  children?: ReactNode;
}

const StyledContent = styled(Content)`
  min-height: 100%;
  padding: 50px;

  @media (max-width: 768px) {
    padding: 20px;
    padding-bottom: 50px;
  }
`;

const StyledLayout = styled(Layout)`
  min-height: 100%;
  background: rgba(0, 0, 0, 0);
`;

const CustomHeader = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const CustomFooter = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const UserLayout: React.FunctionComponent<Props> = props => {
  return (
    <StyledLayout>
      <CustomHeader>
        <Affix offsetTop={0}>
          <UserMenuBar selectedKey={props.selectedKey} />
        </Affix>
      </CustomHeader>
      <StyledContent>{props.children}</StyledContent>
      <Affix offsetBottom={0}>
        <CustomFooter>
          <UserMenuBar selectedKey={props.selectedKey} />
        </CustomFooter>
      </Affix>
    </StyledLayout>
  );
};
export default UserLayout;
