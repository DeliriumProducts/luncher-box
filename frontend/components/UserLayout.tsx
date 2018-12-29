import { Affix, Layout } from 'antd';
import React, { ReactNode } from 'react';
import UserMenuBar from './UserMenuBar';
import styled from 'styled-components';

const StyledDiv = styled.div`
  background-image: ${(props: any) => props.img};
  width: 100%;
  height: 100%;
  display: grid;
  margin: 5px;
  & > * {
    margin: 5px;
  }
`;

interface Props {
  selectedKey: string;
  children?: ReactNode;
  img: string;
}

const UserLayout: React.FunctionComponent<Props> = props => {
  console.log(props);
  return (
    <>
      <Affix offsetTop={0}>
        <UserMenuBar selectedKey={props.selectedKey} />
      </Affix>
      <StyledDiv img={props.img} color="pink">
        {props.children}
      </StyledDiv>
    </>
  );
};
export default UserLayout;
