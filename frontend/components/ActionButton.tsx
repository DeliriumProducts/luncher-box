import { Button } from 'antd';
import styled from 'styled-components';

const StyledButton: any = styled(Button)`
  border: none;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
`;

const ActionButton: React.FunctionComponent<any> = props => (
  <StyledButton {...props}>{props.children}</StyledButton>
);

export default ActionButton;
