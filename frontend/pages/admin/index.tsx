import { Component } from 'react';
import { message } from 'antd';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import { AdminContext } from '../../context';
import EntityCard from '../../components/EntityCard';
import styled from 'styled-components';
import EntityCardContainer from '../../components/EntityCardContainer';
import { Category } from '../../interfaces';
import { CategoryAPI } from '../../api';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  .col {
    flex: 1;
    max-width: 50%;
    height: 100%;
    margin: auto;
  }

  @media (max-width: 768px) {
    .col {
      max-width: 100%;
      margin-top: 3%;
    }

    flex-direction: column;
  }
`;
interface State {
  loading: boolean;
  categories: Category[];
}

class Index extends Component<any, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  state = {
    loading: true,
    categories: []
  };

  formRef: any;

  async componentDidMount() {
    try {
      const categories = await CategoryAPI.getAll();

      if (categories) {
        this.setState({ categories });
      }
    } catch (err) {
      message.error(`${err}`, 3);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, categories } = this.state;

    return (
      <AdminLayout selectedKey="home">
        <FlexContainer>
          <div className="col">
            <EntityCardContainer
              title={`Categories (${categories.length})`}
              entityType="category"
              loading={loading}
            >
              {categories &&
                categories.map((category: Category) => (
                  <EntityCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    image={category.image}
                    hoverable={true}
                    entityType="category"
                  />
                ))}
            </EntityCardContainer>
          </div>
        </FlexContainer>
      </AdminLayout>
    );
  }
}

export default withAuth(Index);
