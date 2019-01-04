import styled from 'styled-components';
import { Card } from 'antd';

const { Meta } = Card;

const StyledCard = styled(Card)``;

type Props = {
  name: string;
  img: string;
};

export default (props: Props) => <StyledCard />;
