import FlexContainer from '../../components/FlexContainer';
import PageHeader from '../../components/PageHeader';
import { withAuth } from '../../hocs';

const StaffChat = () => {
  return (
    <FlexContainer>
      <PageHeader
        title={
          <h1>
            <strong>Staff Chat</strong>
          </h1>
        }
      >
        W I P
      </PageHeader>
    </FlexContainer>
  );
};

export default withAuth(StaffChat);
