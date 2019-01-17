import { Component } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import withRouter from '../../components/withRouter';
import Router, { DefaultQuery } from 'next/router';
import { CategoryAPI } from '../../api';
import withAuth from '../../components/withAuth';
import AdminLayout from '../../components/AdminLayout';
import EntityCardContainer from '../../components/EntityCardContainer';
import EntityCard from '../../components/EntityCard';
import { AdminContext } from '../../context';
import { Product } from '../../interfaces';

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

interface CategoryQuery extends DefaultQuery {
  categoryId: string;
}

interface Props {
  query: CategoryQuery;
}

interface State {
  modalVisible: boolean;
  loading: boolean;
  products: Product[];
}

class CategoryPage extends Component<Props, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  state: State = {
    modalVisible: false,
    loading: true,
    products: []
  };

  formRef: any;

  showModal = (
    entityType: EntityTypes,
    actionType: ActionTypes,
    entity?: EntityInstance
  ) => {
    if (entity) {
      this.setState({
        modalVisible: true,
        entityType,
        actionType,
        entity
      });
    } else {
      this.setState({
        modalVisible: true,
        entityType,
        actionType: 'create',
        entity: undefined
      });
    }
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;

    /**
     * We will need the entity from state when actionType == 'edit'
     * so we destructure it now and then we have to check
     * for undefined because entity is undefined on actionType == 'create'
     */
    const { entity } = this.state;
    form.validateFields(async (err: any, values: any) => {
      if (err) {
        return;
      }

      this.setState({ loading: true });

      try {
        switch (this.state.entityType) {
          case 'category':
            let category: Category = values;

            if (this.state.actionType === 'create') {
              category = (await CategoryAPI.create(category)).data;
              this.context.actions.push(category, 'category');
              message.success(
                `Successfully created category ${category.name} 🎉`
              );
            } else {
              /**
               * First we check for entity because it may be undefined
               * then inject the id of the entity manually since
               * our modal does not return it when actionType == 'edit'
               */
              if (entity) {
                category.id = entity.id;
                category = (await CategoryAPI.edit(category)).data;
                this.context.actions.edit(category, 'category');
                message.success(
                  `Successfully edited category ${category.name} 🎉`
                );
              }
            }
            break;
          case 'product':
            let product: Product = values;

            if (this.state.actionType === 'create') {
              product = (await ProductAPI.create(product)).data;
              this.context.actions.push(product, 'product');
              message.success(
                `Successfully created product ${product.name} 🎉`
              );
            } else {
              /**
               * First we check for entity because it may be undefined
               * then inject the id of the entity manually since
               * our modal does not return it when actionType == 'edit'
               */
              if (entity) {
                product.id = entity.id;
                product = (await ProductAPI.edit(product)).data;
                this.context.actions.edit(product, 'product');
                message.success(
                  `Successfully edited product ${product.name} 🎉`
                );
              }
            }
            break;
          default:
            break;
        }
      } catch (err) {
        this.setState({ loading: false });
        message.error(`${err}`);
      }

      form.resetFields();
      this.setState({ modalVisible: false, loading: false });
    });
  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  handleNewClick = () => {
    this.showModal('product', 'create');
  };

  async componentDidMount() {
    try {
      const products = (await CategoryAPI.getOne(
        Number(this.props.query.categoryId)
      )).products;

      const categories = await CategoryAPI.getAll();

      if (products) {
        this.setState({ products });
      }
    } catch (err) {
      message.error(`${err}, Redirecting you to the home page...`, 3, () =>
        Router.push('/admin')
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, products } = this.state;

    return (
      <AdminLayout selectedKey="home">
        <FlexContainer>
          <div className="col">
            <EntityCardContainer
              title={`Products (${products.length})`}
              entityType="product"
              loading={loading}
              onNewClick={this.handleNewClick}
            >
              {products.map(product => (
                <EntityCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  description={product.description}
                  price={product.price}
                  categories={product.categories}
                  entityType="product"
                />
              ))}
            </EntityCardContainer>
            <EntityModal
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.modalVisible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
              entityType={this.state.entityType}
              actionType={this.state.actionType}
              entity={this.state.entity}
              loading={this.state.loading}
            />
          </div>
        </FlexContainer>
      </AdminLayout>
    );
  }
}

export default withRouter(withAuth(CategoryPage));
