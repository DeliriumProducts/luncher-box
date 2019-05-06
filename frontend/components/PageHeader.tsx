import { PageHeader } from 'antd';
import styled from 'styled-components';

const StyledPageHeader = styled(PageHeader)`
  background-color: #fafafa;
  border-radius: 7px;
  flex: 1;
  background-color: #fafafa;

  @media (max-width: 480px) {
    border-radius: 0;
    margin: 0;
  }
`;

export default StyledPageHeader;
