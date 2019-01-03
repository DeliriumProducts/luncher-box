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
  display: flex;
  align-items: center;
  overflow-wrap: auto;
  border-radius: 7px;
  margin-top: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);

  max-width: 100%;
  @media (max-width: 768x) {
    border-radius: 0;
    border-bottom: 1px olid;
    box-shadow: none;
    margin-top: 0;
  }
`;

const StyledImg = styled.img`
  border-radius: 7px;
  max-height: 64px;
`;

const StyledMeta = styled(Meta)`
  display: flex;
  align-items: center;
`;

export default class EntityCard extends Component<Props, State> {
  state = {
    loading: true
  };

  render() {
    const { loading } = this.state;
    return (
      <StyledCard bordered={false}>
        <StyledMeta
          avatar={<StyledImg src={this.props.image} />}
          title="Card tidddddddfdsfdigfdjgfdkgjfdkgjdfkfhjdfkljdkljhkldjhdflkjgdflkhjsklgjwiert[gdfogjer[ioymdfgbkpn354ipgmdfgi034mgi0n[rtiohddddskjfskdfgjdfkgjdfkgjdfkljkkjkjgfdklgjkdflhjkfgljhfglkhjfklhrtjhoiterjhmgdfigh[e5rtg[idfhjrte[fodigjfdighofggfdoih[jertg[ioperwhrtj[g0rh0ert0ithjtle"
          description="This isddddddddddddddddddddddddddddddddddddddddddddddddddasdasdasdasdasdasdasdasdadadasdasdasdasdasdasdas the description"
        />
      </StyledCard>
    );
  }
}
