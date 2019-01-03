import styled from 'styled-components';
import { Card } from 'antd';

const StyledCard = styled(Card)``;

type Props = {
  name: string;
  img: string;
};

export default (props: Props) => <StyledCard />;
