import { Skeleton, Card, Icon, Avatar } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';

interface Props {
  id: number;
  name: string;
  description?: string;
  image: string;
  price?: number;
}

interface State {
  loading: boolean;
}

const { Meta } = Card;

const StyledCard = styled(Card)`
  border-radius: 7px;
  margin-top: 8px;
  margin-right: 40px;
  margin-left: 40px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    border-radius: 0;
    border-bottom: 1px solid;
    border-bottom-color: rgb(210, 210, 210);
    box-shadow: none;
    margin: 0;
    width: 100%;
  }
`;

const StyledImg = styled.img`
  border-radius: 7px;
  max-height: 64px;

  @media (max-width: 250px) {
    display: none;
  }
`;

const StyledMeta = styled(Meta)`
  display: flex;
  align-items: center;

  & * {
    white-space: initial;
    oferflow-wrap: normal;
  }
`;

export default class EntityCard extends Component<Props, State> {
  state = {
    loading: true
  };

  render() {
    const { loading } = this.state;
    return (
      <StyledCard bordered={false}>
        <Skeleton loading={true} avatar active>
          <StyledMeta
            avatar={<StyledImg src={this.props.image} />}
            title="Card tidddddddfdsfdigfdjgfdkgjfdkgjdfkfhjdfkljdkljhkldjhdflkjgdflkhjsklgjwiert[gdfogjer[ioymdfgbkpn354ipgmdfgi034mgi0n[rtiohddddskjfskdfgjdfkgjdfkgjdfkljkkjkjgfdklgjkdflhjkfgljhfglkhjfklhrtjhoiterjhmgdfigh[e5rtg[idfhjrte[fodigjfdighofggfdoih[jertg[ioperwhrtj[g0rh0ert0ithjtle"
            description="This is some very long long and boring description of this category which I created some time ago when I had no idea what I am doing with css so I was rlly dummb u know"
          />
        </Skeleton>
      </StyledCard>
    );
  }
}
