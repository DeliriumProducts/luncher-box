import styled from 'styled-components';
import { Card } from 'antd';

const { Meta } = Card;

const StyledCard = styled(Card)`
  min-width: 256px;
  border-radius: 7px;
  margin: 5px 2.5px 0 2.5px;
  position: relative;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
`;

const StyledMeta = styled(Meta)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 4px;
`;

const StyledImg = styled.img`
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  display: cover;
`;

type Props = {
  name: string;
  image: string;
  description: string;
  price: string;
};

export default (props: Props) => (
  <StyledCard
    bordered={false}
    cover={<StyledImg alt="example" src={props.image} />}
  >
    <StyledMeta title={props.name} description={props.description} />
  </StyledCard>
);
