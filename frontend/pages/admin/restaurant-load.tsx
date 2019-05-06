import React, { Component } from 'react';
import styled from 'styled-components';
import { withAuth } from '../../hocs';

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
    return <>???????</>;
  }
}

export default withAuth(RestaurantLoad);
