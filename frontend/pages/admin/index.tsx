import { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import { EntityContext } from '../../context';
import EntityCard from '../../components/EntityCard';
import styled from 'styled-components';
import EntityCardContainer from '../../components/EntityCardContainer';

const FlexboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
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
        ok nigga
        <EntityCardContainer title="Categories (64)">
          <EntityCard
            name="nadenica"
            description="dadasjdhffkfkkfkfkfkfkdsjfksdjfdsflsjfsf;ljsfs;lfkjdsf;lajsf;ljsdf;ljsdf;ljksdf;ljsf;sfjlsf;lsdjfsf;lsjdfdjsk"
            image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg"
          />
          <EntityCard
            name="nadenica"
            description="dadasjdhffkfkkfkfkfkfkdsjfksdjfdsflsjfsf;ljsfs;lfkjdsf;lajsf;ljsdf;ljsdf;ljksdf;ljsf;sfjlsf;lsdjfsf;lsjdfdjsk"
            image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg"
          />
          <EntityCard
            name="nadenica"
            description="dadasjdhffkfkkfkfkfkfkdsjfksdjfdsflsjfsf;ljsfs;lfkjdsf;lajsf;ljsdf;ljsdf;ljksdf;ljsf;sfjlsf;lsdjfsf;lsjdfdjsk"
            image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg"
          />
        </EntityCardContainer>
      </AdminLayout>
    );
  }
}

export default withAuth(Index);
