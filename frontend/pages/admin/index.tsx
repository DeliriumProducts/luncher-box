import { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';
import { EntityContext } from '../../context';
import EntityCard from '../../components/EntityCard';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
`;

class Index extends Component {
  static contextType = EntityContext;
  context!: React.ContextType<typeof EntityContext>;

  componentDidMount() {
    this.context.actions.updateEntities();
  }

  render() {
    return (
      <AdminLayout selectedKey="home">
        dasdasdas
        <FlexContainer>
          <EntityCard image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg" />
          <EntityCard image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg" />
          <EntityCard image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg" />
          <EntityCard image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg" />
        </FlexContainer>
      </AdminLayout>
    );
  }
}

export default withAuth(Index);
