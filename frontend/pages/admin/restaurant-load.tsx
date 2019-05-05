import React, { Component } from 'react';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  .col {
    flex: 1;
    max-width: 70%;
    height: 100%;
    margin: auto;
  }

  @media (max-width: 768px) {
    .col {
      max-width: 100%;
    }

    flex-direction: column;
  }
`;

class RestaurantLoad extends Component {
  render() {
    return <FullHeightContainer>???????</FullHeightContainer>;
  }
}

export default withAuth(RestaurantLoad);
