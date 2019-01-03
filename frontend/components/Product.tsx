import styled from 'styled-components';
import { Card } from 'antd';

const { Meta } = Card;

const StyledCard = styled(Card)`
  min-width: 256px;
  max-width: 512px;
  border-radius: 7px;
  margin: 8px 4px 0 4px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
  & img {
    border-radius: 7px 7px 0 0;
    max-height: 128px;
    object-fit: cover;
    display: cover;
  }
`;

const StyledMeta = styled(Meta)`
  display: flex;
  align-items: center;
  & * {
    white-space: initial;
  }
`;

type Props = {
  name: string;
  image: string;
  description: string;
  price: string;
};

export default (props: Props) => (
  <StyledCard bordered={false} cover={<img alt="example" src={props.image} />}>
    <StyledMeta title={props.name} description={props.description} />
  </StyledCard>
);
